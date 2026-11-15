import {
  type Project,
  type StudioNode,
  type StudioEdge,
  type EdgeDirection,
  type EdgeFlowType,
  CURRENT_SCHEMA_VERSION,
  DEFAULT_PROJECT_SETTINGS,
} from '@/lib/schemas';
import {
  MCSS_FORMAT_IDENTIFIER,
  MCSS_SCHEMA_VERSION,
  MCSS_CATALOG_VERSION,
  type MCSSDiagramDocument,
  type MCSSNode,
  type MCSSEdge,
  type MCSSScene,
  type MCSSDrawing,
  type MCSSEdgeDirection,
  type MCSSEdgeFlowType,
} from '../domain/diagram-format';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';

/**
 * Maps internal Studio edge direction to canonical MCSS direction.
 */
function toMCSSDirection(dir?: EdgeDirection | MCSSEdgeDirection): MCSSEdgeDirection {
  if (dir === 'sourceToTarget' || dir === 'forward') return 'forward';
  if (dir === 'targetToSource' || dir === 'reverse') return 'reverse';
  if (dir === 'bidirectional') return 'bidirectional';
  return 'none';
}

/**
 * Maps canonical MCSS edge direction to internal Studio direction.
 */
function toStudioDirection(dir?: MCSSEdgeDirection | EdgeDirection): EdgeDirection {
  if (dir === 'forward' || dir === 'sourceToTarget') return 'sourceToTarget';
  if (dir === 'reverse' || dir === 'targetToSource') return 'targetToSource';
  if (dir === 'bidirectional') return 'bidirectional';
  return 'none';
}

/**
 * Maps canonical MCSS flowType to internal Studio flowType.
 */
function toStudioFlowType(flow?: MCSSEdgeFlowType | EdgeFlowType): EdgeFlowType {
  if (flow === 'logical') return 'generic';
  if (
    flow === 'http' ||
    flow === 'data' ||
    flow === 'events' ||
    flow === 'network' ||
    flow === 'auth' ||
    flow === 'generic'
  ) {
    return flow;
  }
  return 'generic';
}

/**
 * Serializes an internal Studio Project into the canonical MCSS Diagram Format v1.0.0.
 */
export function serializeToMCSS(
  project: Project,
  origin: 'ai' | 'human' | 'export' = 'export'
): MCSSDiagramDocument {
  const nodes: MCSSNode[] = project.nodes.map((node) => ({
    id: node.id,
    kind: node.kind,
    label: node.label,
    position: { x: node.position.x, y: node.position.y },
    serviceId: node.serviceId,
    size: node.size ? { width: node.size.width, height: node.size.height } : undefined,
    parentId: node.parentId,
    properties: node.properties || {},
    notes: node.notes || '',
    style: node.style,
  }));

  const edges: MCSSEdge[] = project.edges.map((edge) => ({
    id: edge.id,
    sourceId: edge.sourceId,
    targetId: edge.targetId,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    direction: toMCSSDirection(edge.direction),
    flowType: edge.flowType,
    label: edge.label,
    animated: edge.animated,
    style: edge.style,
  }));

  const drawings: MCSSDrawing[] = project.drawings.map((draw) => ({
    id: draw.id,
    points: draw.points.map((p) => ({ x: p.x, y: p.y })),
    strokeWidth: draw.strokeWidth,
    color: draw.color,
    layer: draw.layer,
  }));

  const scenes: MCSSScene[] = project.scenes.map((scene) => ({
    id: scene.id,
    order: scene.order,
    title: scene.title,
    description: scene.description,
    speakerNotes: scene.speakerNotes,
    viewport: {
      x: scene.viewport.x,
      y: scene.viewport.y,
      zoom: scene.viewport.zoom,
    },
    nodeHighlights: scene.highlightNodeIds || [],
    edgeHighlights: scene.highlightEdgeIds || [],
    animatedEdgeIds: scene.animatedEdgeIds || [],
  }));

  return {
    format: MCSS_FORMAT_IDENTIFIER,
    schemaVersion: MCSS_SCHEMA_VERSION,
    catalogVersion: project.catalogVersion || MCSS_CATALOG_VERSION,
    metadata: {
      title: project.title,
      description: `Arquitetura exportada do MultiCloud Solution Studio`,
      origin,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    },
    diagram: {
      nodes,
      edges,
      drawings,
      scenes,
      viewport: {
        x: project.viewport.x,
        y: project.viewport.y,
        zoom: project.viewport.zoom,
      },
      settings: project.settings || DEFAULT_PROJECT_SETTINGS,
    },
  };
}

/**
 * Deserializes a canonical MCSS Diagram Document into an internal Studio Project.
 */
export function deserializeFromMCSS(
  doc: MCSSDiagramDocument,
  options?: { newProjectId?: string; titlePrefix?: string }
): Project {
  const now = new Date().toISOString();
  const id =
    options?.newProjectId ||
    `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  const title = options?.titlePrefix
    ? `${doc.metadata.title} (${options.titlePrefix})`
    : doc.metadata.title;

  const nodes: StudioNode[] = doc.diagram.nodes.map((node) => {
    let providerId = undefined;
    let effectiveKind = node.kind;

    if (node.kind === 'service' && node.serviceId) {
      const catalogService = getCatalogServiceById(node.serviceId);
      if (catalogService) {
        providerId = catalogService.providerId;
      } else {
        // Unknown service fallback (CA5-20): render as generic, preserve serviceId in properties
        effectiveKind = 'generic';
      }
    }

    return {
      id: node.id,
      kind: effectiveKind,
      serviceId: node.serviceId,
      providerId,
      label: node.label,
      position: { x: node.position.x, y: node.position.y },
      size: node.size ? { width: node.size.width, height: node.size.height } : undefined,
      parentId: node.parentId,
      properties: {
        ...node.properties,
        ...(node.serviceId ? { originalServiceId: node.serviceId } : {}),
      },
      notes: node.notes || '',
      style: node.style,
    };
  });

  const edges: StudioEdge[] = doc.diagram.edges.map((edge) => ({
    id: edge.id,
    sourceId: edge.sourceId,
    targetId: edge.targetId,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    direction: toStudioDirection(edge.direction),
    flowType: toStudioFlowType(edge.flowType),
    label: edge.label,
    animated: edge.animated || false,
    style: edge.style,
  }));

  const drawings = (doc.diagram.drawings || []).map((draw) => ({
    id: draw.id,
    points: draw.points.map((p) => ({ x: p.x, y: p.y })),
    strokeWidth: draw.strokeWidth || 2,
    color: draw.color || '#111827',
    layer: draw.layer || 0,
  }));

  const scenes = (doc.diagram.scenes || []).map((scene) => ({
    id: scene.id,
    order: scene.order,
    title: scene.title,
    description: scene.description,
    speakerNotes: scene.speakerNotes,
    viewport: {
      x: scene.viewport?.x || 0,
      y: scene.viewport?.y || 0,
      zoom: scene.viewport?.zoom || 1,
    },
    highlightNodeIds: scene.nodeHighlights || [],
    highlightEdgeIds: scene.edgeHighlights || [],
    animatedEdgeIds: scene.animatedEdgeIds || [],
  }));

  return {
    id,
    title,
    createdAt: doc.metadata.createdAt || now,
    updatedAt: now,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    catalogVersion: doc.catalogVersion || MCSS_CATALOG_VERSION,
    viewport: {
      x: doc.diagram.viewport?.x || 0,
      y: doc.diagram.viewport?.y || 0,
      zoom: doc.diagram.viewport?.zoom || 1,
    },
    nodes,
    edges,
    drawings,
    scenes,
    settings: doc.diagram.settings || DEFAULT_PROJECT_SETTINGS,
  };
}

/**
 * Detects and adapts legacy project files (pre-PRD 5) into MCSS Diagram Document format.
 */
export function adaptLegacyProjectToMCSS(rawObj: unknown): MCSSDiagramDocument | null {
  if (typeof rawObj !== 'object' || rawObj === null) return null;

  const obj = rawObj as Record<string, unknown>;

  // Reject unsupported future legacy schema version
  if (typeof obj.schemaVersion === 'number' && obj.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return null;
  }

  // Legacy format A: ExportedProjectFile { schemaVersion: 1, project: { ... } }
  let rawProject: Record<string, unknown> | null = null;
  if (obj.project && typeof obj.project === 'object') {
    rawProject = obj.project as Record<string, unknown>;
  } else if (Array.isArray(obj.nodes) && Array.isArray(obj.edges) && typeof obj.title === 'string') {
    // Legacy format B: raw Project object
    rawProject = obj;
  }

  if (!rawProject) return null;

  if (typeof rawProject.schemaVersion === 'number' && rawProject.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return null;
  }

  const title = typeof rawProject.title === 'string' ? rawProject.title : 'Projeto Importado';
  const nodes = Array.isArray(rawProject.nodes) ? (rawProject.nodes as StudioNode[]) : [];
  const edges = Array.isArray(rawProject.edges) ? (rawProject.edges as StudioEdge[]) : [];

  return {
    format: MCSS_FORMAT_IDENTIFIER,
    schemaVersion: MCSS_SCHEMA_VERSION,
    catalogVersion: MCSS_CATALOG_VERSION,
    metadata: {
      title,
      description: 'Convertido de arquivo legado do MultiCloud Solution Studio',
      origin: 'export',
      createdAt: typeof rawProject.createdAt === 'string' ? rawProject.createdAt : undefined,
      updatedAt: typeof rawProject.updatedAt === 'string' ? rawProject.updatedAt : undefined,
    },
    diagram: {
      nodes: nodes.map((n) => ({
        id: n.id,
        kind: n.kind,
        label: n.label,
        position: { x: n.position?.x || 0, y: n.position?.y || 0 },
        serviceId: n.serviceId,
        size: n.size,
        parentId: n.parentId,
        properties: n.properties || {},
        notes: n.notes || '',
        style: n.style,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        sourceId: e.sourceId,
        targetId: e.targetId,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        direction: toMCSSDirection(e.direction),
        flowType: e.flowType || 'http',
        label: e.label,
        animated: e.animated,
        style: e.style,
      })),
      drawings: Array.isArray(rawProject.drawings) ? (rawProject.drawings as MCSSDrawing[]) : [],
      scenes: Array.isArray(rawProject.scenes) ? (rawProject.scenes as MCSSScene[]) : [],
      viewport:
        rawProject.viewport && typeof rawProject.viewport === 'object'
          ? (rawProject.viewport as { x: number; y: number; zoom: number })
          : { x: 0, y: 0, zoom: 1 },
      settings: DEFAULT_PROJECT_SETTINGS,
    },
  };
}
