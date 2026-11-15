import { z } from 'zod';

export const MCSS_FORMAT_IDENTIFIER = 'mcss.diagram' as const;
export const MCSS_SCHEMA_VERSION = '1.0.0' as const;
export const MCSS_CATALOG_VERSION = '1.0.0' as const;

// Security and resource limits (PRD 5 Section 14)
export const MCSS_MAX_PAYLOAD_SIZE = 3 * 1024 * 1024; // 3 MiB
export const MCSS_MAX_NODES = 500;
export const MCSS_MAX_EDGES = 1000;
export const MCSS_MAX_DRAWINGS = 300;
export const MCSS_MAX_SCENES = 50;
export const MCSS_MAX_DRAWING_POINTS = 20000;

export const MCSSNodeKindSchema = z.enum([
  'service',
  'generic',
  'group',
  'shape',
  'note',
  'text',
]);
export type MCSSNodeKind = z.infer<typeof MCSSNodeKindSchema>;

export const MCSSPositionSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});
export type MCSSPosition = z.infer<typeof MCSSPositionSchema>;

export const MCSSSizeSchema = z.object({
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
});
export type MCSSSize = z.infer<typeof MCSSSizeSchema>;

export const MCSSNodeSchema = z.object({
  id: z.string().min(1).max(128),
  kind: MCSSNodeKindSchema,
  label: z.string().max(256),
  position: MCSSPositionSchema,
  serviceId: z.string().max(128).optional(),
  size: MCSSSizeSchema.optional(),
  parentId: z.string().max(128).optional(),
  properties: z.record(z.string(), z.unknown()).default({}),
  notes: z.string().max(10000).default(''),
  style: z.record(z.string(), z.unknown()).optional(),
  extensions: z.record(z.string(), z.unknown()).optional(),
});
export type MCSSNode = z.infer<typeof MCSSNodeSchema>;

export const MCSSEdgeDirectionSchema = z.enum([
  'forward',
  'reverse',
  'bidirectional',
  'none',
  // Allow internal aliases for backward compatibility
  'sourceToTarget',
  'targetToSource',
]);
export type MCSSEdgeDirection = z.infer<typeof MCSSEdgeDirectionSchema>;

export const MCSSEdgeFlowTypeSchema = z.enum([
  'http',
  'data',
  'events',
  'network',
  'auth',
  'generic',
  'logical',
]);
export type MCSSEdgeFlowType = z.infer<typeof MCSSEdgeFlowTypeSchema>;

export const MCSSEdgeSchema = z.object({
  id: z.string().min(1).max(128),
  sourceId: z.string().min(1).max(128),
  targetId: z.string().min(1).max(128),
  sourceHandle: z.string().max(64).optional(),
  targetHandle: z.string().max(64).optional(),
  direction: MCSSEdgeDirectionSchema.default('forward'),
  flowType: MCSSEdgeFlowTypeSchema.default('logical'),
  label: z.string().max(128).optional(),
  animated: z.boolean().optional().default(false),
  style: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().max(5000).optional(),
  extensions: z.record(z.string(), z.unknown()).optional(),
});
export type MCSSEdge = z.infer<typeof MCSSEdgeSchema>;

export const MCSSDrawingPointSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});
export type MCSSDrawingPoint = z.infer<typeof MCSSDrawingPointSchema>;

export const MCSSDrawingSchema = z.object({
  id: z.string().min(1).max(128),
  points: z.array(MCSSDrawingPointSchema).max(10000),
  strokeWidth: z.number().finite().positive().default(2),
  color: z.string().max(32).default('#111827'),
  layer: z.number().int().default(0),
});
export type MCSSDrawing = z.infer<typeof MCSSDrawingSchema>;

export const MCSSViewportSchema = z.object({
  x: z.number().finite().default(0),
  y: z.number().finite().default(0),
  zoom: z.number().finite().positive().default(1),
});
export type MCSSViewport = z.infer<typeof MCSSViewportSchema>;

export const MCSSSceneSchema = z.object({
  id: z.string().min(1).max(128),
  order: z.number().int().min(0),
  title: z.string().min(1).max(256),
  description: z.string().max(2000).optional(),
  speakerNotes: z.string().max(10000).optional(), // Presentation script notes strictly on scenes
  viewport: MCSSViewportSchema.default({ x: 0, y: 0, zoom: 1 }),
  nodeHighlights: z.array(z.string().max(128)).default([]),
  edgeHighlights: z.array(z.string().max(128)).default([]),
  animatedEdgeIds: z.array(z.string().max(128)).default([]),
});
export type MCSSScene = z.infer<typeof MCSSSceneSchema>;

export const MCSSMetadataSchema = z.object({
  title: z.string().min(1).max(256),
  description: z.string().max(2000).optional(),
  origin: z.enum(['ai', 'human', 'export']).optional().default('ai'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type MCSSMetadata = z.infer<typeof MCSSMetadataSchema>;

export const MCSSDiagramSchema = z.object({
  nodes: z.array(MCSSNodeSchema).default([]),
  edges: z.array(MCSSEdgeSchema).default([]),
  drawings: z.array(MCSSDrawingSchema).default([]),
  scenes: z.array(MCSSSceneSchema).default([]),
  viewport: MCSSViewportSchema.default({ x: 0, y: 0, zoom: 1 }),
  settings: z
    .object({
      snapToGrid: z.boolean().default(false),
      showGrid: z.boolean().default(true),
      reduceMotion: z.boolean().default(false),
    })
    .default({ snapToGrid: false, showGrid: true, reduceMotion: false }),
  extensions: z.record(z.string(), z.unknown()).optional(),
});
export type MCSSDiagram = z.infer<typeof MCSSDiagramSchema>;

export const MCSSDiagramDocumentSchema = z.object({
  format: z.literal(MCSS_FORMAT_IDENTIFIER),
  schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  catalogVersion: z.string().optional(),
  metadata: MCSSMetadataSchema,
  diagram: MCSSDiagramSchema,
  extensions: z.record(z.string(), z.unknown()).optional(),
});
export type MCSSDiagramDocument = z.infer<typeof MCSSDiagramDocumentSchema>;
