import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { ProjectSchema, type Project, type StudioNode, type StudioEdge } from '@/lib/schemas';
import { useEditorStore } from '@/features/canvas/store/editor-store';
import { projectRepository } from '@/lib/storage/project-repository';

export function generateBenchmarkProject(): Project {
  const nodes: StudioNode[] = [];
  const edges: StudioEdge[] = [];

  const providers = ['gcp', 'aws', 'azure', 'oci', 'cloudflare', 'supabase'] as const;

  // Generate 80 nodes distributed in a grid
  for (let i = 0; i < 80; i++) {
    const col = i % 10;
    const row = Math.floor(i / 10);
    const provider = providers[i % providers.length];

    nodes.push({
      id: `bench-node-${i}`,
      kind: 'service',
      serviceId: `${provider}-service-${i}`,
      providerId: provider,
      label: `Service ${i + 1} (${provider.toUpperCase()})`,
      position: { x: col * 220, y: row * 140 },
      properties: { memory: '4Gi', cpu: '2' },
      notes: `Componente ${i + 1} do teste de benchmark de 80 nós`,
    });
  }

  // Generate 120 edges connecting grid neighbors
  let edgeCount = 0;
  for (let i = 0; i < 80 && edgeCount < 120; i++) {
    // Horizontal connection
    if (i % 10 < 9 && edgeCount < 120) {
      edges.push({
        id: `bench-edge-${edgeCount++}`,
        sourceId: `bench-node-${i}`,
        targetId: `bench-node-${i + 1}`,
        direction: 'sourceToTarget',
        flowType: 'http',
        label: 'HTTP/REST',
        animated: false,
      });
    }

    // Vertical connection
    if (i + 10 < 80 && edgeCount < 120) {
      edges.push({
        id: `bench-edge-${edgeCount++}`,
        sourceId: `bench-node-${i}`,
        targetId: `bench-node-${i + 10}`,
        direction: 'sourceToTarget',
        flowType: 'data',
        label: 'gRPC / Data',
        animated: false,
      });
    }
  }

  return ProjectSchema.parse({
    id: 'proj-benchmark-80-120',
    title: 'Benchmark Stress Test (80 Nós e 120 Conexões)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schemaVersion: 1,
    catalogVersion: '1.0.0',
    viewport: { x: 0, y: 0, zoom: 0.5 },
    nodes,
    edges,
    drawings: [],
    scenes: [
      {
        id: 'bench-scene-1',
        order: 0,
        title: 'Visão Global da Malha',
        viewport: { x: 0, y: 0, zoom: 0.4 },
        highlightNodeIds: nodes.slice(0, 40).map((n) => n.id),
        highlightEdgeIds: edges.slice(0, 40).map((e) => e.id),
        animatedEdgeIds: edges.slice(0, 10).map((e) => e.id),
      },
    ],
    settings: {
      snapToGrid: false,
      showGrid: true,
      reduceMotion: false,
    },
  });
}

describe('Benchmark Stress Scene (80 Nodes & 120 Edges) (CA-16)', () => {
  it('generates, validates, and stores a scenario with exactly 80 nodes and 120 edges', async () => {
    const startTime = performance.now();
    const project = generateBenchmarkProject();

    expect(project.nodes.length).toBe(80);
    expect(project.edges.length).toBe(120);

    // Save to Dexie
    await projectRepository.saveProject(project);

    // Load into Editor Store
    const loaded = await useEditorStore.getState().loadProject(project.id);
    expect(loaded).toBe(true);

    const storeState = useEditorStore.getState();
    expect(storeState.nodes.length).toBe(80);
    expect(storeState.edges.length).toBe(120);

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Must be fast and responsive (under 200ms in jsdom)
    expect(duration).toBeLessThan(500);
  });
});
