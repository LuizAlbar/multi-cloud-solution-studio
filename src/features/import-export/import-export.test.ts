import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { createExportPayload } from './export-project';
import {
  parseAndValidateProjectFile,
  importProjectFromJson,
  InvalidProjectFileError,
} from './import-project';
import { projectRepository } from '@/lib/storage/project-repository';
import type { Project } from '@/lib/schemas';

describe('Import & Export (.mcss.json) (CA-08, CA-09)', () => {
  const sampleProject: Project = {
    id: 'proj-export-test',
    title: 'E-commerce Multicloud',
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
        label: 'API Service',
        position: { x: 100, y: 100 },
        properties: { env: 'prod' },
        notes: 'Microsserviço de pagamentos',
      },
    ],
    edges: [],
    drawings: [],
    scenes: [],
    settings: {
      snapToGrid: false,
      showGrid: true,
      reduceMotion: false,
    },
  };

  it('exports project with schemaVersion and required envelope (CA-08)', () => {
    const payload = createExportPayload(sampleProject);
    expect(payload.schemaVersion).toBe(1);
    expect(payload.appVersion).toBe('1.0.0');
    expect(payload.exportedAt).toBeTruthy();
    expect(payload.project.title).toBe('E-commerce Multicloud');
    expect(payload.project.nodes.length).toBe(1);
  });

  it('imports valid exported project JSON and creates independent project in Dexie', async () => {
    const payload = createExportPayload(sampleProject);
    const jsonStr = JSON.stringify(payload);

    const imported = await importProjectFromJson(jsonStr);

    expect(imported.id).not.toBe(sampleProject.id); // Fresh ID
    expect(imported.title).toContain('E-commerce Multicloud');
    expect(imported.nodes.length).toBe(1);
    expect(imported.nodes[0].label).toBe('API Service');

    // Confirm it was saved to DB
    const fetched = await projectRepository.getProject(imported.id);
    expect(fetched).toBeDefined();
    expect(fetched?.id).toBe(imported.id);
  });

  it('rejects malformed or invalid JSON with user-friendly error without corrupting state (CA-09)', async () => {
    const badJson = '{ corrupted: true, missingBrace: ';
    expect(() => parseAndValidateProjectFile(badJson)).toThrow(
      InvalidProjectFileError
    );

    const nonProjectJson = JSON.stringify({ randomKey: 'hello world' });
    expect(() => parseAndValidateProjectFile(nonProjectJson)).toThrow(
      InvalidProjectFileError
    );
  });

  it('rejects files with unsupported future schemaVersion', () => {
    const futurePayload = {
      schemaVersion: 999,
      appVersion: '9.0.0',
      exportedAt: new Date().toISOString(),
      project: sampleProject,
    };

    expect(() =>
      parseAndValidateProjectFile(JSON.stringify(futurePayload))
    ).toThrow(InvalidProjectFileError);
  });
});
