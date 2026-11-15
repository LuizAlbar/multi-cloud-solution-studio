import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/features/canvas/store/editor-store';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';

describe('History (Undo / Redo) 20+ Operations (CA-06)', () => {
  beforeEach(async () => {
    useEditorStore.setState({
      project: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      saveStatus: 'saved',
      history: { past: [], future: [] },
    });

    await useEditorStore.getState().initNewProject('History 20 Ops Test');
  });

  it('handles 22 consecutive operations with clean undo and redo without orphan edges', () => {
    const store = useEditorStore.getState();
    const service1 = getCatalogServiceById('gcp-cloud-run')!;
    const service2 = getCatalogServiceById('gcp-bigquery')!;

    // Perform 22 actions
    // 1-10: Add 10 nodes
    for (let i = 0; i < 10; i++) {
      store.addServiceNode(service1, { x: i * 50, y: 100 });
    }
    expect(useEditorStore.getState().nodes.length).toBe(10);

    // 11-15: Connect pairs of nodes (5 connections)
    const currentNodes = useEditorStore.getState().nodes;
    for (let i = 0; i < 5; i++) {
      store.onConnect({
        source: currentNodes[i].id,
        target: currentNodes[i + 5].id,
        sourceHandle: 'right-source',
        targetHandle: 'left-target',
      });
    }
    expect(useEditorStore.getState().edges.length).toBe(5);

    // 16-20: Update labels on 5 nodes
    for (let i = 0; i < 5; i++) {
      store.updateNodeLabel(currentNodes[i].id, `Renamed Node ${i}`);
    }

    // 21: Add another node
    store.addServiceNode(service2, { x: 800, y: 300 });
    expect(useEditorStore.getState().nodes.length).toBe(11);

    // 22: Delete the first node (which has an edge, so attached edge must also be removed)
    store.selectNode(currentNodes[0].id);
    store.deleteSelected();

    const stateAt22 = useEditorStore.getState();
    expect(stateAt22.nodes.length).toBe(10);
    expect(stateAt22.edges.length).toBe(4); // 5 - 1 = 4 edges (no orphan edges!)

    // Now test Undo: undo all 22 operations
    for (let step = 0; step < 22; step++) {
      expect(useEditorStore.getState().canUndo()).toBe(true);
      useEditorStore.getState().undo();
    }

    // After 22 undos, state must return to empty
    const stateAt0 = useEditorStore.getState();
    expect(stateAt0.nodes.length).toBe(0);
    expect(stateAt0.edges.length).toBe(0);
    expect(stateAt0.canUndo()).toBe(false);

    // Now test Redo: redo all 22 operations
    for (let step = 0; step < 22; step++) {
      expect(useEditorStore.getState().canRedo()).toBe(true);
      useEditorStore.getState().redo();
    }

    // After 22 redos, state must be restored identically
    const stateAtRedo22 = useEditorStore.getState();
    expect(stateAtRedo22.nodes.length).toBe(10);
    expect(stateAtRedo22.edges.length).toBe(4);
    expect(stateAtRedo22.canRedo()).toBe(false);
  });
});
