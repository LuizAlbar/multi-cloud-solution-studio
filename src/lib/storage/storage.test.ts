import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { StudioDatabase } from './db';
import { ProjectRepository } from './project-repository';
import type { Project } from '@/lib/schemas';

describe('ProjectRepository with Dexie / IndexedDB', () => {
  let testDb: StudioDatabase;
  let repo: ProjectRepository;

  beforeEach(() => {
    // Unique db name per test to prevent contamination
    testDb = new StudioDatabase(`test-db-${Date.now()}-${Math.random()}`);
    repo = new ProjectRepository(testDb);
  });

  const createSampleProject = (id: string, title: string): Project => ({
    id,
    title,
    createdAt: '2026-11-14T10:00:00.000Z',
    updatedAt: '2026-11-14T10:00:00.000Z',
    schemaVersion: 1,
    catalogVersion: '1.0.0',
    viewport: { x: 0, y: 0, zoom: 1 },
    nodes: [
      {
        id: 'node-1',
        kind: 'service',
        serviceId: 'gcp-cloud-run',
        providerId: 'gcp',
        label: 'API Server',
        position: { x: 100, y: 150 },
        properties: {},
        notes: '',
      },
      {
        id: 'node-2',
        kind: 'service',
        serviceId: 'supabase-postgres',
        providerId: 'supabase',
        label: 'Database',
        position: { x: 300, y: 150 },
        properties: {},
        notes: '',
      },
    ],
    edges: [
      {
        id: 'edge-1',
        sourceId: 'node-1',
        targetId: 'node-2',
        direction: 'sourceToTarget',
        flowType: 'data',
        label: 'SQL Queries',
        animated: false,
      },
    ],
    drawings: [],
    scenes: [],
    settings: {
      snapToGrid: false,
      showGrid: true,
      reduceMotion: false,
    },
  });

  it('saves and retrieves a project', async () => {
    const proj = createSampleProject('proj-1', 'Minha Arquitetura');
    await repo.saveProject(proj);

    const fetched = await repo.getProject('proj-1');
    expect(fetched).toBeDefined();
    expect(fetched?.title).toBe('Minha Arquitetura');
    expect(fetched?.nodes.length).toBe(2);
    expect(fetched?.edges.length).toBe(1);
  });

  it('lists projects with calculated summaries', async () => {
    const proj1 = createSampleProject('proj-1', 'App Alpha');
    const proj2 = createSampleProject('proj-2', 'App Beta');

    await repo.saveProject(proj1);
    await repo.saveProject(proj2);

    const list = await repo.listProjects();
    expect(list.length).toBe(2);
    expect(list.map((p) => p.title)).toContain('App Alpha');
    expect(list.map((p) => p.title)).toContain('App Beta');

    const alphaSummary = list.find((p) => p.id === 'proj-1');
    expect(alphaSummary?.nodeCount).toBe(2);
    expect(alphaSummary?.edgeCount).toBe(1);
    expect(alphaSummary?.providers).toContain('gcp');
    expect(alphaSummary?.providers).toContain('supabase');
  });

  it('deletes a project and its thumbnail', async () => {
    const proj = createSampleProject('proj-to-delete', 'To Delete');
    await repo.saveProject(proj);
    await repo.saveThumbnail('proj-to-delete', 'data:image/png;base64,sample');

    expect(await repo.getProject('proj-to-delete')).toBeDefined();
    expect(await repo.getThumbnail('proj-to-delete')).toBe('data:image/png;base64,sample');

    await repo.deleteProject('proj-to-delete');

    expect(await repo.getProject('proj-to-delete')).toBeUndefined();
    expect(await repo.getThumbnail('proj-to-delete')).toBeUndefined();
  });

  it('duplicates a project with a new ID and title suffix', async () => {
    const original = createSampleProject('proj-orig', 'Cenário Base');
    await repo.saveProject(original);

    const copy = await repo.duplicateProject('proj-orig');
    expect(copy.id).not.toBe('proj-orig');
    expect(copy.title).toBe('Cenário Base (Cópia)');
    expect(copy.nodes.length).toBe(original.nodes.length);

    // Both should exist independently in DB
    const list = await repo.listProjects();
    expect(list.length).toBe(2);
  });

  it('toggles favorite and lists extracted services', async () => {
    const proj = createSampleProject('proj-fav', 'Projeto Favorito');
    await repo.saveProject(proj);

    expect(await repo.toggleFavorite('proj-fav')).toBe(true);
    let summary = (await repo.listProjects()).find((p) => p.id === 'proj-fav');
    expect(summary?.isFavorite).toBe(true);
    expect(summary?.services).toContain('gcp-cloud-run');
    expect(summary?.services).toContain('supabase-postgres');

    expect(await repo.toggleFavorite('proj-fav')).toBe(false);
    summary = (await repo.listProjects()).find((p) => p.id === 'proj-fav');
    expect(summary?.isFavorite).toBe(false);
  });
});
