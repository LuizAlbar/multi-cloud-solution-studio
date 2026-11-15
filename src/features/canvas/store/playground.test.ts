import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from './editor-store';
import { getCatalogServiceById } from '@/features/catalog/catalog-service';
import { projectRepository } from '@/lib/storage/project-repository';
import { createExportPayload } from '@/features/import-export/export-project';

describe('Playground Mode (RF2-01)', () => {
  beforeEach(async () => {
    // Reset store
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

    // Ensure database is clean
    const existing = await projectRepository.listProjects();
    for (const p of existing) {
      await projectRepository.deleteProject(p.id);
    }
  });

  it('starts in ephemeral stateless mode and never auto-saves to IndexedDB', async () => {
    const store = useEditorStore.getState();

    // 1. Init playground
    store.initPlayground();
    expect(useEditorStore.getState().isPlayground).toBe(true);
    expect(useEditorStore.getState().nodes.length).toBe(0);

    // Confirm no project was created in IndexedDB
    const initialList = await projectRepository.listProjects();
    expect(initialList.length).toBe(0);

    // 2. Add services in playground
    const s1 = getCatalogServiceById('gcp-cloud-run')!;
    const s2 = getCatalogServiceById('cloudflare-workers')!;

    store.addServiceNode(s1, { x: 100, y: 100 });
    store.addServiceNode(s2, { x: 300, y: 100 });

    const [n1, n2] = useEditorStore.getState().nodes;
    store.onConnect({
      source: n1.id,
      target: n2.id,
      sourceHandle: 'right-source',
      targetHandle: 'left-target',
    });

    expect(useEditorStore.getState().nodes.length).toBe(2);
    expect(useEditorStore.getState().edges.length).toBe(1);

    // 3. Try to save explicitly - should be a no-op because isPlayground is true
    await store.saveProjectNow();

    // Confirm IndexedDB remains 100% empty (stateless between sessions)
    const listAfterWork = await projectRepository.listProjects();
    expect(listAfterWork.length).toBe(0);

    // 4. Manual export to JSON works directly from playground memory
    const currentProject = useEditorStore.getState().project!;
    const payload = createExportPayload({
      ...currentProject,
      nodes: useEditorStore.getState().nodes.map((n) => ({
        id: n.id,
        kind: 'service',
        serviceId: n.data.serviceId as string,
        providerId: n.data.providerId as any,
        label: n.data.label as string,
        position: n.position,
        properties: {},
        notes: '',
      })),
      edges: useEditorStore.getState().edges.map((e) => ({
        id: e.id,
        sourceId: e.source,
        targetId: e.target,
        direction: 'sourceToTarget',
        flowType: 'http',
        animated: false,
      })),
    });

    expect(payload.format).toBe('mcss.diagram');
    expect(payload.schemaVersion).toBe('1.0.0');
    expect(payload.diagram.nodes.length).toBe(2);
  });

  it('converts playground into a real persisted project only upon explicit user opt-in', async () => {
    const store = useEditorStore.getState();
    store.initPlayground();

    const s1 = getCatalogServiceById('gcp-cloud-run')!;
    store.addServiceNode(s1, { x: 100, y: 100 });

    expect((await projectRepository.listProjects()).length).toBe(0);

    // User explicitly clicks "Salvar como projeto"
    const converted = await store.convertPlaygroundToProject('Meu Projeto Salvo');

    expect(converted.id).not.toBe('playground');
    expect(converted.title).toBe('Meu Projeto Salvo');
    expect(useEditorStore.getState().isPlayground).toBe(false);

    // Now it exists in IndexedDB
    const savedList = await projectRepository.listProjects();
    expect(savedList.length).toBe(1);
    expect(savedList[0].id).toBe(converted.id);
  });
});
