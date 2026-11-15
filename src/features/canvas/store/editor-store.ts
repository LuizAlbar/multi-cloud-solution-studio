import { create } from 'zustand';
import {
  type Node as FlowNode,
  type Edge as FlowEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
} from '@xyflow/react';
import type {
  Project,
  StudioNode,
  StudioEdge,
  CatalogService,
  Drawing,
  Scene,
} from '@/lib/schemas';
import { projectRepository } from '@/lib/storage/project-repository';

export type ToolMode =
  | 'select'
  | 'pan'
  | 'connect'
  | 'shape'
  | 'text'
  | 'sticky'
  | 'pen'
  | 'eraser';

export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved';

export interface EditorState {
  project: Project | null;
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  activeTool: ToolMode;
  saveStatus: SaveStatus;
  saveErrorMessage: string | null;
  isPlayground: boolean;
  history: {
    past: { nodes: FlowNode[]; edges: FlowEdge[] }[];
    future: { nodes: FlowNode[]; edges: FlowEdge[] }[];
  };

  // Actions
  setProject: (project: Project) => void;
  initNewProject: (title?: string) => Promise<Project>;
  initPlayground: () => void;
  convertPlaygroundToProject: (title?: string) => Promise<Project>;
  loadProject: (id: string) => Promise<boolean>;
  updateProjectTitle: (title: string) => void;
  setActiveTool: (tool: ToolMode) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;

  // React Flow handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Domain actions
  addServiceNode: (
    service: CatalogService,
    position: { x: number; y: number }
  ) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeProperties: (
    id: string,
    properties: Record<string, unknown>
  ) => void;
  updateNodeNotes: (id: string, notes: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Persistence
  saveProjectNow: () => Promise<void>;
}

// Helper to convert domain StudioNode to FlowNode
export function studioNodeToFlowNode(node: StudioNode): FlowNode {
  return {
    id: node.id,
    type: node.kind === 'service' ? 'service' : node.kind,
    position: node.position,
    data: {
      label: node.label,
      serviceName: node.label,
      serviceId: node.serviceId,
      providerId: node.providerId,
      properties: node.properties,
      notes: node.notes,
      speakerNotes: node.speakerNotes,
    },
  };
}

// Helper to convert FlowNode to domain StudioNode
export function flowNodeToStudioNode(node: FlowNode): StudioNode {
  const data = (node.data || {}) as Record<string, unknown>;
  return {
    id: node.id,
    kind: (node.type === 'service' ? 'service' : (node.type || 'service')) as any,
    serviceId: typeof data.serviceId === 'string' ? data.serviceId : undefined,
    providerId: typeof data.providerId === 'string' ? (data.providerId as any) : undefined,
    label: typeof data.label === 'string' ? data.label : 'Node',
    position: { x: node.position.x, y: node.position.y },
    properties: (data.properties as Record<string, unknown>) || {},
    notes: typeof data.notes === 'string' ? data.notes : '',
    speakerNotes: typeof data.speakerNotes === 'string' ? data.speakerNotes : undefined,
  };
}

// Helper to convert domain StudioEdge to FlowEdge
export function studioEdgeToFlowEdge(edge: StudioEdge): FlowEdge {
  return {
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    label: edge.label,
    animated: edge.animated,
    data: {
      flowType: edge.flowType,
      direction: edge.direction,
    },
  };
}

// Helper to convert FlowEdge to domain StudioEdge
export function flowEdgeToStudioEdge(edge: FlowEdge): StudioEdge {
  const data = (edge.data || {}) as Record<string, unknown>;
  return {
    id: edge.id,
    sourceId: edge.source,
    targetId: edge.target,
    sourceHandle: edge.sourceHandle || undefined,
    targetHandle: edge.targetHandle || undefined,
    direction: (data.direction as any) || 'sourceToTarget',
    flowType: (data.flowType as any) || 'http',
    label: typeof edge.label === 'string' ? edge.label : undefined,
    animated: Boolean(edge.animated),
  };
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const MAX_HISTORY_STEPS = 30;

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  activeTool: 'select',
  saveStatus: 'saved',
  saveErrorMessage: null,
  isPlayground: false,
  history: {
    past: [],
    future: [],
  },

  setProject: (project: Project) => {
    const flowNodes = project.nodes.map(studioNodeToFlowNode);
    const flowEdges = project.edges.map(studioEdgeToFlowEdge);
    set({
      project,
      nodes: flowNodes,
      edges: flowEdges,
      selectedNodeId: null,
      selectedEdgeId: null,
      saveStatus: 'saved',
      isPlayground: false,
      history: { past: [], future: [] },
    });
  },

  initNewProject: async (title = 'Novo Projeto de Solução') => {
    const newProj: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
      catalogVersion: '1.0.0',
      viewport: { x: 0, y: 0, zoom: 1 },
      nodes: [],
      edges: [],
      drawings: [],
      scenes: [],
      settings: {
        snapToGrid: false,
        showGrid: true,
        reduceMotion: false,
      },
    };

    await projectRepository.saveProject(newProj);
    get().setProject(newProj);
    return newProj;
  },

  initPlayground: () => {
    const ephemeralProject: Project = {
      id: 'playground',
      title: 'Playground',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schemaVersion: 1,
      catalogVersion: '1.0.0',
      viewport: { x: 0, y: 0, zoom: 1 },
      nodes: [],
      edges: [],
      drawings: [],
      scenes: [],
      settings: {
        snapToGrid: false,
        showGrid: true,
        reduceMotion: false,
      },
    };

    set({
      isPlayground: true,
      project: ephemeralProject,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      saveStatus: 'unsaved',
      history: { past: [], future: [] },
    });
  },

  convertPlaygroundToProject: async (title = 'Projeto do Playground') => {
    const { project, nodes, edges } = get();
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const realProject: Project = {
      ...(project || {
        schemaVersion: 1,
        catalogVersion: '1.0.0',
        viewport: { x: 0, y: 0, zoom: 1 },
        drawings: [],
        scenes: [],
        settings: { snapToGrid: false, showGrid: true, reduceMotion: false },
      }),
      id: newId,
      title,
      createdAt: now,
      updatedAt: now,
      nodes: nodes.map(flowNodeToStudioNode),
      edges: edges.map(flowEdgeToStudioEdge),
    };

    await projectRepository.saveProject(realProject);
    set({
      isPlayground: false,
      project: realProject,
      saveStatus: 'saved',
    });
    return realProject;
  },

  loadProject: async (id: string) => {
    try {
      const proj = await projectRepository.getProject(id);
      if (!proj) return false;
      get().setProject(proj);
      return true;
    } catch {
      return false;
    }
  },

  updateProjectTitle: (title: string) => {
    const { project } = get();
    if (!project) return;
    set({
      project: { ...project, title },
      saveStatus: 'unsaved',
    });
    scheduleAutoSave(get);
  },

  setActiveTool: (tool: ToolMode) => {
    set({ activeTool: tool });
  },

  selectNode: (id: string | null) => {
    set({ selectedNodeId: id, selectedEdgeId: null });
  },

  selectEdge: (id: string | null) => {
    set({ selectedEdgeId: id, selectedNodeId: null });
  },

  onNodesChange: (changes) => {
    const currentNodes = get().nodes;
    const nextNodes = applyNodeChanges(changes, currentNodes);
    set({ nodes: nextNodes, saveStatus: 'unsaved' });
    scheduleAutoSave(get);
  },

  onEdgesChange: (changes) => {
    const currentEdges = get().edges;
    const nextEdges = applyEdgeChanges(changes, currentEdges);
    set({ edges: nextEdges, saveStatus: 'unsaved' });
    scheduleAutoSave(get);
  },

  onConnect: (connection: Connection) => {
    pushHistoryState(set, get);
    const edgeId = `edge-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEdge: FlowEdge = {
      ...connection,
      id: edgeId,
      label: 'HTTP',
      data: {
        flowType: 'http',
        direction: 'sourceToTarget',
      },
    };
    const nextEdges = addEdge(newEdge, get().edges);
    set({ edges: nextEdges, selectedEdgeId: edgeId, saveStatus: 'unsaved' });
    scheduleAutoSave(get);
  },

  addServiceNode: (service: CatalogService, position: { x: number; y: number }) => {
    pushHistoryState(set, get);
    const nodeId = `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newNode: FlowNode = {
      id: nodeId,
      type: 'service',
      position,
      data: {
        label: service.displayName,
        serviceName: service.displayName,
        serviceId: service.serviceId,
        providerId: service.providerId,
        category: service.category,
        properties: {},
        notes: '',
        speakerNotes: '',
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: nodeId,
      saveStatus: 'unsaved',
    });
    scheduleAutoSave(get);
  },

  updateNodeLabel: (id: string, label: string) => {
    pushHistoryState(set, get);
    const nextNodes = get().nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            label,
          },
        };
      }
      return node;
    });

    set({ nodes: nextNodes, saveStatus: 'unsaved' });
    scheduleAutoSave(get);
  },

  updateNodeProperties: (id: string, properties: Record<string, unknown>) => {
    const nextNodes = get().nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            properties,
          },
        };
      }
      return node;
    });

    set({ nodes: nextNodes, saveStatus: 'unsaved' });
    scheduleAutoSave(get);
  },

  updateNodeNotes: (id: string, notes: string) => {
    const nextNodes = get().nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            notes,
          },
        };
      }
      return node;
    });

    set({ nodes: nextNodes, saveStatus: 'unsaved' });
    scheduleAutoSave(get);
  },

  deleteSelected: () => {
    const { selectedNodeId, selectedEdgeId, nodes, edges } = get();
    if (!selectedNodeId && !selectedEdgeId) return;

    pushHistoryState(set, get);

    if (selectedNodeId) {
      const nextNodes = nodes.filter((n) => n.id !== selectedNodeId);
      // Remove attached edges to avoid orphan edges (CA-06)
      const nextEdges = edges.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      );
      set({
        nodes: nextNodes,
        edges: nextEdges,
        selectedNodeId: null,
        saveStatus: 'unsaved',
      });
    } else if (selectedEdgeId) {
      const nextEdges = edges.filter((e) => e.id !== selectedEdgeId);
      set({
        edges: nextEdges,
        selectedEdgeId: null,
        saveStatus: 'unsaved',
      });
    }

    scheduleAutoSave(get);
  },

  duplicateSelected: () => {
    const { selectedNodeId, nodes } = get();
    if (!selectedNodeId) return;

    const nodeToDup = nodes.find((n) => n.id === selectedNodeId);
    if (!nodeToDup) return;

    pushHistoryState(set, get);

    const newNodeId = `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const clonedNode: FlowNode = {
      ...nodeToDup,
      id: newNodeId,
      position: {
        x: nodeToDup.position.x + 40,
        y: nodeToDup.position.y + 40,
      },
      data: {
        ...nodeToDup.data,
        label: `${(nodeToDup.data?.label as string) || 'Node'} (Cópia)`,
      },
      selected: true,
    };

    set({
      nodes: [...nodes.map((n) => ({ ...n, selected: false })), clonedNode],
      selectedNodeId: newNodeId,
      saveStatus: 'unsaved',
    });
    scheduleAutoSave(get);
  },

  undo: () => {
    const { history, nodes, edges } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: {
        past: newPast,
        future: [{ nodes, edges }, ...history.future],
      },
      saveStatus: 'unsaved',
    });
    scheduleAutoSave(get);
  },

  redo: () => {
    const { history, nodes, edges } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      history: {
        past: [...history.past, { nodes, edges }],
        future: newFuture,
      },
      saveStatus: 'unsaved',
    });
    scheduleAutoSave(get);
  },

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,

  saveProjectNow: async () => {
    const { project, nodes, edges, isPlayground } = get();
    // Do not save to storage if in playground mode or no project (RF2-01)
    if (!project || isPlayground) return;

    set({ saveStatus: 'saving', saveErrorMessage: null });

    try {
      const updatedProject: Project = {
        ...project,
        nodes: nodes.map(flowNodeToStudioNode),
        edges: edges.map(flowEdgeToStudioEdge),
        updatedAt: new Date().toISOString(),
      };

      await projectRepository.saveProject(updatedProject);
      set({ project: updatedProject, saveStatus: 'saved' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar projeto localmente';
      set({ saveStatus: 'error', saveErrorMessage: msg });
    }
  },
}));

function pushHistoryState(
  set: (fn: (state: EditorState) => Partial<EditorState>) => void,
  get: () => EditorState
) {
  const { nodes, edges, history } = get();
  const nextPast = [...history.past, { nodes, edges }];
  if (nextPast.length > MAX_HISTORY_STEPS) {
    nextPast.shift();
  }
  set(() => ({
    history: {
      past: nextPast,
      future: [],
    },
  }));
}

function scheduleAutoSave(get: () => EditorState) {
  // Never schedule autosave in playground mode (RF2-01)
  if (get().isPlayground) {
    return;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    get().saveProjectNow();
  }, 1000); // 1s debounce as recommended
}
