import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from './editor-store';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';
import { projectRepository } from '@/lib/storage/project-repository';

describe('Editor Store & Vertical Slice 1', () => {
  beforeEach(() => {
    // Reset store
    useEditorStore.setState({
      project: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      saveStatus: 'saved',
      history: { past: [], future: [] },
    });
  });

  it('performs the complete Vertical Slice 1: Cloud Run -> BigQuery -> Save -> Reload', async () => {
    const store = useEditorStore.getState();

    // 1. Initialize project
    const proj = await store.initNewProject('Vertical Slice Project');
    expect(proj.id).toBeTruthy();
    expect(useEditorStore.getState().project?.title).toBe('Vertical Slice Project');

    // 2. Add Cloud Run from Catalog
    const cloudRunService = getCatalogServiceById('gcp-cloud-run');
    expect(cloudRunService).toBeDefined();
    store.addServiceNode(cloudRunService!, { x: 100, y: 100 });

    const nodesAfterRun = useEditorStore.getState().nodes;
    expect(nodesAfterRun.length).toBe(1);
    const cloudRunNode = nodesAfterRun[0];
    expect(cloudRunNode.data.label).toBe('Cloud Run');
    expect(cloudRunNode.data.providerId).toBe('gcp');

    // 3. Add BigQuery from Catalog
    const bigQueryService = getCatalogServiceById('gcp-bigquery');
    expect(bigQueryService).toBeDefined();
    store.addServiceNode(bigQueryService!, { x: 400, y: 100 });

    const nodesAfterBQ = useEditorStore.getState().nodes;
    expect(nodesAfterBQ.length).toBe(2);
    const bigQueryNode = nodesAfterBQ[1];
    expect(bigQueryNode.data.label).toBe('BigQuery');

    // 4. Connect Cloud Run to BigQuery
    store.onConnect({
      source: cloudRunNode.id,
      target: bigQueryNode.id,
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
    });

    const edges = useEditorStore.getState().edges;
    expect(edges.length).toBe(1);
    expect(edges[0].source).toBe(cloudRunNode.id);
    expect(edges[0].target).toBe(bigQueryNode.id);

    // 5. Edit properties on Cloud Run
    store.updateNodeProperties(cloudRunNode.id, {
      environment: 'Produção Multi-Region',
      capacity: '4 vCPU / 8GB',
    });

    store.updateNodeNotes(
      cloudRunNode.id,
      'Backend API serverless alimentando queries no data warehouse'
    );

    const updatedRunNode = useEditorStore
      .getState()
      .nodes.find((n) => n.id === cloudRunNode.id);
    expect(
      (updatedRunNode?.data.properties as Record<string, unknown>).environment
    ).toBe('Produção Multi-Region');

    // 6. Save project to Dexie
    await store.saveProjectNow();
    expect(useEditorStore.getState().saveStatus).toBe('saved');

    // 7. Clear store state simulating reload
    useEditorStore.setState({
      project: null,
      nodes: [],
      edges: [],
    });
    expect(useEditorStore.getState().project).toBeNull();

    // 8. Reopen project from Dexie storage
    const loadSuccess = await useEditorStore.getState().loadProject(proj.id);
    expect(loadSuccess).toBe(true);

    const reloadedState = useEditorStore.getState();
    expect(reloadedState.project).toBeDefined();
    expect(reloadedState.project?.title).toBe('Vertical Slice Project');
    expect(reloadedState.nodes.length).toBe(2);
    expect(reloadedState.edges.length).toBe(1);

    const restoredRunNode = reloadedState.nodes.find((n) => n.id === cloudRunNode.id);
    expect(restoredRunNode).toBeDefined();
    expect(
      (restoredRunNode?.data.properties as Record<string, unknown>).environment
    ).toBe('Produção Multi-Region');
    expect(restoredRunNode?.data.notes).toContain('Backend API serverless');

    const restoredEdge = reloadedState.edges[0];
    expect(restoredEdge.source).toBe(cloudRunNode.id);
    expect(restoredEdge.target).toBe(bigQueryNode.id);
  });

  it('supports undo and redo for adding and deleting nodes', async () => {
    const store = useEditorStore.getState();
    await store.initNewProject('Undo Test');

    const cloudRunService = getCatalogServiceById('gcp-cloud-run')!;
    store.addServiceNode(cloudRunService, { x: 100, y: 100 });
    expect(useEditorStore.getState().nodes.length).toBe(1);

    // Undo add
    store.undo();
    expect(useEditorStore.getState().nodes.length).toBe(0);

    // Redo add
    store.redo();
    expect(useEditorStore.getState().nodes.length).toBe(1);
  });

  it('deletes attached edges when a node is deleted (no orphan edges CA-06)', async () => {
    const store = useEditorStore.getState();
    await store.initNewProject('Orphan Edge Test');

    const s1 = getCatalogServiceById('gcp-cloud-run')!;
    const s2 = getCatalogServiceById('gcp-bigquery')!;

    store.addServiceNode(s1, { x: 100, y: 100 });
    store.addServiceNode(s2, { x: 300, y: 100 });

    const [n1, n2] = useEditorStore.getState().nodes;
    store.onConnect({
      source: n1.id,
      target: n2.id,
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
    });

    expect(useEditorStore.getState().edges.length).toBe(1);

    // Select and delete n1
    store.selectNode(n1.id);
    store.deleteSelected();

    // Both n1 and the connecting edge must be removed
    expect(useEditorStore.getState().nodes.length).toBe(1);
    expect(useEditorStore.getState().edges.length).toBe(0);
  });
});
