import { describe, it, expect } from 'vitest';
import {
  serializeToMCSS,
  deserializeFromMCSS,
  adaptLegacyProjectToMCSS,
} from './serialization/serializer';
import {
  validateMCSSDiagramJson,
  sanitizePastedJson,
} from './validation/validator';
import {
  MCSS_FORMAT_IDENTIFIER,
  MCSS_SCHEMA_VERSION,
  type MCSSDiagramDocument,
} from './domain/diagram-format';
import type { Project } from '@/lib/schemas';

describe('MCSS Diagram Format v1.0.0 (PRD 5)', () => {
  const sampleProject: Project = {
    id: 'proj-sample-1',
    title: 'Arquitetura Multicloud E-commerce',
    createdAt: '2026-11-15T00:00:00.000Z',
    updatedAt: '2026-11-15T00:00:00.000Z',
    schemaVersion: 1,
    catalogVersion: '1.0.0',
    viewport: { x: 50, y: 100, zoom: 1.2 },
    nodes: [
      {
        id: 'node-client',
        kind: 'generic',
        label: 'Usuário Web',
        position: { x: 100, y: 200 },
        properties: { clientType: 'browser' },
        notes: 'Acessa via HTTPS',
      },
      {
        id: 'node-app',
        kind: 'service',
        serviceId: 'gcp-cloud-run',
        providerId: 'gcp',
        label: 'API Serverless',
        position: { x: 400, y: 200 },
        properties: { environment: 'production', capacity: '2 vCPU' },
        notes: 'Microsserviço de pedidos',
      },
      {
        id: 'node-db',
        kind: 'service',
        serviceId: 'aws-rds',
        providerId: 'aws',
        label: 'Banco Relacional',
        position: { x: 750, y: 200 },
        properties: { engine: 'postgres' },
        notes: 'Multi-AZ',
      },
      {
        id: 'group-zone-1',
        kind: 'group',
        label: 'Zona AWS - us-east-1',
        position: { x: 700, y: 100 },
        properties: { providerId: 'aws', region: 'us-east-1' },
        notes: 'VPC Primária',
      },
    ],
    edges: [
      {
        id: 'edge-client-to-app',
        sourceId: 'node-client',
        targetId: 'node-app',
        direction: 'sourceToTarget',
        flowType: 'http',
        label: 'HTTPS / REST',
        animated: true,
      },
      {
        id: 'edge-app-to-db',
        sourceId: 'node-app',
        targetId: 'node-db',
        direction: 'sourceToTarget',
        flowType: 'data',
        label: 'JDBC / SQL',
        animated: false,
      },
    ],
    drawings: [
      {
        id: 'draw-1',
        points: [
          { x: 10, y: 20 },
          { x: 30, y: 40 },
        ],
        strokeWidth: 3,
        color: '#6366F1',
        layer: 1,
      },
    ],
    scenes: [
      {
        id: 'scene-1',
        order: 0,
        title: 'Visão Geral do Fluxo',
        description: 'Primeira cena da apresentação',
        speakerNotes: 'Apresentar aos stakeholders o fluxo de requisição do usuário.',
        viewport: { x: 0, y: 0, zoom: 1 },
        highlightNodeIds: ['node-client', 'node-app'],
        highlightEdgeIds: ['edge-client-to-app'],
        animatedEdgeIds: ['edge-client-to-app'],
      },
    ],
    settings: {
      snapToGrid: true,
      showGrid: true,
      reduceMotion: false,
    },
  };

  it('serializes Studio project to valid MCSS Diagram Document format', () => {
    const doc = serializeToMCSS(sampleProject, 'export');

    expect(doc.format).toBe(MCSS_FORMAT_IDENTIFIER);
    expect(doc.schemaVersion).toBe(MCSS_SCHEMA_VERSION);
    expect(doc.metadata.title).toBe(sampleProject.title);
    expect(doc.diagram.nodes.length).toBe(4);
    expect(doc.diagram.edges.length).toBe(2);
    expect(doc.diagram.drawings.length).toBe(1);
    expect(doc.diagram.scenes.length).toBe(1);
    expect(doc.diagram.scenes[0].speakerNotes).toBe(sampleProject.scenes[0].speakerNotes);
  });

  it('guarantees round-trip equivalence: encode(decode(encode(doc))) ≈ encode(doc)', () => {
    const doc1 = serializeToMCSS(sampleProject);
    const restoredProject = deserializeFromMCSS(doc1);
    const doc2 = serializeToMCSS(restoredProject);

    expect(doc2.format).toBe(doc1.format);
    expect(doc2.schemaVersion).toBe(doc1.schemaVersion);
    expect(doc2.metadata.title).toBe(doc1.metadata.title);
    expect(doc2.diagram.nodes.length).toBe(doc1.diagram.nodes.length);
    expect(doc2.diagram.edges.length).toBe(doc1.diagram.edges.length);
    expect(doc2.diagram.scenes.length).toBe(doc1.diagram.scenes.length);
    expect(doc2.diagram.drawings.length).toBe(doc1.diagram.drawings.length);

    // Verify node properties and notes preserved
    const appNode1 = doc1.diagram.nodes.find((n) => n.id === 'node-app')!;
    const appNode2 = doc2.diagram.nodes.find((n) => n.id === 'node-app')!;
    expect(appNode2.label).toBe(appNode1.label);
    expect(appNode2.serviceId).toBe(appNode1.serviceId);
    expect(appNode2.notes).toBe(appNode1.notes);

    // Verify edges direction and flowType preserved
    const edge1 = doc1.diagram.edges[0];
    const edge2 = doc2.diagram.edges[0];
    expect(edge2.direction).toBe(edge1.direction);
    expect(edge2.flowType).toBe(edge1.flowType);
    expect(edge2.label).toBe(edge1.label);
  });

  it('validates a valid MCSS JSON string successfully', () => {
    const doc = serializeToMCSS(sampleProject);
    const jsonString = JSON.stringify(doc);

    const report = validateMCSSDiagramJson(jsonString);
    expect(report.isValid).toBe(true);
    expect(report.hasErrors).toBe(false);
    expect(report.summary.nodeCount).toBe(4);
    expect(report.summary.edgeCount).toBe(2);
    expect(report.summary.providers).toContain('gcp');
    expect(report.summary.providers).toContain('aws');
  });

  it('sanitizes markdown code fences ```json ... ``` safely', () => {
    const rawPasted = '```json\n{\n  "format": "mcss.diagram"\n}\n```';
    const cleaned = sanitizePastedJson(rawPasted);
    expect(cleaned).toBe('{\n  "format": "mcss.diagram"\n}');
  });

  it('blocks orphan edges with explicit error diagnostics', () => {
    const invalidDoc: MCSSDiagramDocument = {
      format: MCSS_FORMAT_IDENTIFIER,
      schemaVersion: MCSS_SCHEMA_VERSION,
      metadata: { title: 'Teste Órfão', origin: 'ai' },
      diagram: {
        nodes: [
          {
            id: 'node-1',
            kind: 'generic',
            label: 'Nó 1',
            position: { x: 0, y: 0 },
            properties: {},
            notes: '',
          },
        ],
        edges: [
          {
            id: 'edge-broken',
            sourceId: 'node-1',
            targetId: 'node-nonexistent',
            direction: 'forward',
            flowType: 'logical',
            animated: false,
          },
        ],
        drawings: [],
        scenes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        settings: { snapToGrid: false, showGrid: true, reduceMotion: false },
      },
    };

    const report = validateMCSSDiagramJson(JSON.stringify(invalidDoc));
    expect(report.isValid).toBe(false);
    expect(report.hasErrors).toBe(true);

    const targetNotFoundIssue = report.issues.find((i) => i.code === 'EDGE_TARGET_NOT_FOUND');
    expect(targetNotFoundIssue).toBeDefined();
    expect(targetNotFoundIssue?.path).toBe('/diagram/edges/0/targetId');
  });

  it('detects duplicate node IDs and rejects import', () => {
    const invalidDoc: MCSSDiagramDocument = {
      format: MCSS_FORMAT_IDENTIFIER,
      schemaVersion: MCSS_SCHEMA_VERSION,
      metadata: { title: 'Teste Duplicado', origin: 'ai' },
      diagram: {
        nodes: [
          {
            id: 'node-dup',
            kind: 'generic',
            label: 'A',
            position: { x: 0, y: 0 },
            properties: {},
            notes: '',
          },
          {
            id: 'node-dup',
            kind: 'generic',
            label: 'B',
            position: { x: 10, y: 10 },
            properties: {},
            notes: '',
          },
        ],
        edges: [],
        drawings: [],
        scenes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        settings: { snapToGrid: false, showGrid: true, reduceMotion: false },
      },
    };

    const report = validateMCSSDiagramJson(JSON.stringify(invalidDoc));
    expect(report.isValid).toBe(false);
    expect(report.issues.some((i) => i.code === 'DUPLICATE_NODE_ID')).toBe(true);
  });

  it('handles unknown serviceId as a warning with fallback to generic (CA5-20)', () => {
    const unknownServiceDoc: MCSSDiagramDocument = {
      format: MCSS_FORMAT_IDENTIFIER,
      schemaVersion: MCSS_SCHEMA_VERSION,
      metadata: { title: 'Serviço Futuro', origin: 'ai' },
      diagram: {
        nodes: [
          {
            id: 'node-future',
            kind: 'service',
            serviceId: 'gcp-future-quantum-mesh-2028',
            label: 'Serviço Novo',
            position: { x: 100, y: 100 },
            properties: { tier: 'enterprise' },
            notes: 'Serviço ainda não cadastrado',
          },
        ],
        edges: [],
        drawings: [],
        scenes: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        settings: { snapToGrid: false, showGrid: true, reduceMotion: false },
      },
    };

    const report = validateMCSSDiagramJson(JSON.stringify(unknownServiceDoc));
    // Warnings do not invalidate the document
    expect(report.isValid).toBe(true);
    expect(report.hasWarnings).toBe(true);
    expect(report.hasErrors).toBe(false);
    expect(report.summary.unknownServices).toContain('gcp-future-quantum-mesh-2028');

    // Deserializing falls back to generic while preserving serviceId in properties
    const project = deserializeFromMCSS(unknownServiceDoc);
    const fallbackNode = project.nodes[0];
    expect(fallbackNode.kind).toBe('generic');
    expect(fallbackNode.properties.originalServiceId).toBe('gcp-future-quantum-mesh-2028');
  });

  it('adapts legacy exported project format seamlessly (CA5-30)', () => {
    const legacyExport = {
      schemaVersion: 1,
      appVersion: '1.0.0',
      exportedAt: '2026-11-14T00:00:00.000Z',
      project: {
        id: 'legacy-proj-1',
        title: 'Projeto Legado v1',
        createdAt: '2026-11-14T00:00:00.000Z',
        updatedAt: '2026-11-14T00:00:00.000Z',
        schemaVersion: 1,
        catalogVersion: '1.0.0',
        viewport: { x: 0, y: 0, zoom: 1 },
        nodes: [
          {
            id: 'legacy-node-1',
            kind: 'service',
            serviceId: 'aws-ec2',
            label: 'EC2 Instance',
            position: { x: 100, y: 100 },
            properties: {},
            notes: '',
          },
        ],
        edges: [],
        drawings: [],
        scenes: [],
      },
    };

    const adapted = adaptLegacyProjectToMCSS(legacyExport);
    expect(adapted).not.toBeNull();
    expect(adapted?.format).toBe(MCSS_FORMAT_IDENTIFIER);
    expect(adapted?.schemaVersion).toBe(MCSS_SCHEMA_VERSION);
    expect(adapted?.metadata.title).toBe('Projeto Legado v1');
    expect(adapted?.diagram.nodes[0].serviceId).toBe('aws-ec2');
  });
});
