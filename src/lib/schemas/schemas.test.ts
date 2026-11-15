import { describe, it, expect } from 'vitest';
import {
  ProjectSchema,
  ExportedProjectFileSchema,
  CatalogServiceSchema,
  CURRENT_SCHEMA_VERSION,
} from './index';

describe('Zod Schemas', () => {
  it('validates a valid CatalogService', () => {
    const raw = {
      serviceId: 'gcp-cloud-run',
      providerId: 'gcp',
      displayName: 'Cloud Run',
      aliases: ['run', 'container', 'serverless'],
      category: 'compute',
      tags: ['serverless', 'containers'],
      iconKey: 'gcp-cloud-run',
      shortDescription: 'Deploy and run containerized apps on serverless platform',
      officialDocsUrl: 'https://cloud.google.com/run',
      lastReviewedAt: '2026-11-14',
    };

    const parsed = CatalogServiceSchema.parse(raw);
    expect(parsed.serviceId).toBe('gcp-cloud-run');
    expect(parsed.category).toBe('compute');
    expect(parsed.assetLicense).toBe('Official vendor guidelines');
  });

  it('rejects invalid CatalogService missing required fields or bad URL', () => {
    const bad = {
      serviceId: 'bad',
      providerId: 'unknown-provider',
      displayName: '',
      officialDocsUrl: 'not-a-url',
    };

    const result = CatalogServiceSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it('validates a valid Project and applies defaults', () => {
    const project = {
      id: 'proj-123',
      title: 'Multicloud E-commerce',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [
        {
          id: 'node-1',
          kind: 'service',
          serviceId: 'gcp-cloud-run',
          providerId: 'gcp',
          label: 'Backend API',
          position: { x: 100, y: 200 },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          sourceId: 'node-1',
          targetId: 'node-2',
          direction: 'sourceToTarget',
          flowType: 'http',
          label: 'REST Call',
        },
      ],
    };

    const parsed = ProjectSchema.parse(project);
    expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(parsed.catalogVersion).toBe('1.0.0');
    expect(parsed.nodes[0].properties).toEqual({});
    expect(parsed.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
    expect(parsed.drawings).toEqual([]);
    expect(parsed.scenes).toEqual([]);
    expect(parsed.settings.showGrid).toBe(true);
  });

  it('validates ExportedProjectFileSchema', () => {
    const exported = {
      schemaVersion: 1,
      appVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: {
        id: 'proj-1',
        title: 'Test',
        createdAt: '2026-11-14T00:00:00.000Z',
        updatedAt: '2026-11-14T00:00:00.000Z',
      },
    };

    const parsed = ExportedProjectFileSchema.parse(exported);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.project.title).toBe('Test');
  });

  it('rejects ExportedProjectFile without schemaVersion or with corrupted project', () => {
    const corrupted = {
      appVersion: '1.0.0',
      project: {
        id: 'proj-1',
      },
    };

    const result = ExportedProjectFileSchema.safeParse(corrupted);
    expect(result.success).toBe(false);
  });
});
