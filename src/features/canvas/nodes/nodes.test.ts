import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../store/editor-store';

describe('Generic Shapes & Handles Connections', () => {
  beforeEach(async () => {
    useEditorStore.setState({
      project: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      saveStatus: 'saved',
      isPlayground: false,
      history: { past: [], future: [] },
    });

    await useEditorStore.getState().initNewProject('Generic Shapes Test');
  });

  it('allows establishing connections from and to right, bottom, left and top handles on generic shapes', () => {
    const store = useEditorStore.getState();

    // Add rectangle shape
    const rectNode = {
      id: 'rect-1',
      type: 'shape',
      position: { x: 100, y: 100 },
      data: { label: 'Retângulo', shapeType: 'rectangle' },
    };

    // Add circle shape
    const circleNode = {
      id: 'circle-1',
      type: 'shape',
      position: { x: 400, y: 100 },
      data: { label: 'Círculo', shapeType: 'circle' },
    };

    // Add generic database shape with label "Banco de Dados"
    const dbNode = {
      id: 'db-1',
      type: 'shape',
      position: { x: 400, y: 300 },
      data: { label: 'Banco de Dados', shapeType: 'generic-db' },
    };

    useEditorStore.setState({
      nodes: [rectNode, circleNode, dbNode],
    });

    // 1. Connect rectangle RIGHT handle to circle LEFT handle
    store.onConnect({
      source: rectNode.id,
      target: circleNode.id,
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
    });

    // 2. Connect circle BOTTOM handle to database TOP handle
    store.onConnect({
      source: circleNode.id,
      target: dbNode.id,
      sourceHandle: 'bottom-source',
      targetHandle: 'top-target',
    });

    // 3. Connect database LEFT handle to rectangle BOTTOM handle
    store.onConnect({
      source: dbNode.id,
      target: rectNode.id,
      sourceHandle: 'left-source',
      targetHandle: 'bottom-target',
    });

    const edges = useEditorStore.getState().edges;
    expect(edges.length).toBe(3);

    // Verify edge 1 uses lateral handles
    expect(edges[0].sourceHandle).toBe('right-source');
    expect(edges[0].targetHandle).toBe('left-target');

    // Verify edge 2 uses bottom and top handles
    expect(edges[1].sourceHandle).toBe('bottom-source');
    expect(edges[1].targetHandle).toBe('top-target');

    // Verify edge 3 uses lateral and bottom handles
    expect(edges[2].sourceHandle).toBe('left-source');
    expect(edges[2].targetHandle).toBe('bottom-target');

    // Verify label is "Banco de Dados"
    const db = useEditorStore.getState().nodes.find((n) => n.id === 'db-1');
    expect(db?.data.label).toBe('Banco de Dados');
    expect(db?.data.label).not.toContain('Genérico');
  });
});
