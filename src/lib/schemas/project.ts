import { z } from 'zod';
import { ProviderIdSchema } from './catalog';

export const ViewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number().default(1),
});
export type Viewport = z.infer<typeof ViewportSchema>;

export const NodeKindSchema = z.enum([
  'service',
  'generic',
  'group',
  'shape',
  'note',
  'text',
]);
export type NodeKind = z.infer<typeof NodeKindSchema>;

export const NodePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export type NodePosition = z.infer<typeof NodePositionSchema>;

export const NodeSizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});
export type NodeSize = z.infer<typeof NodeSizeSchema>;

export const StudioNodeSchema = z.object({
  id: z.string().min(1),
  kind: NodeKindSchema,
  serviceId: z.string().optional(),
  providerId: ProviderIdSchema.optional(),
  label: z.string(),
  position: NodePositionSchema,
  size: NodeSizeSchema.optional(),
  parentId: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).default({}),
  notes: z.string().default(''),
  speakerNotes: z.string().optional(),
  style: z.record(z.string(), z.unknown()).optional(),
});
export type StudioNode = z.infer<typeof StudioNodeSchema>;

export const EdgeDirectionSchema = z.enum([
  'bidirectional',
  'sourceToTarget',
  'targetToSource',
  'none',
]);
export type EdgeDirection = z.infer<typeof EdgeDirectionSchema>;

export const EdgeFlowTypeSchema = z.enum([
  'http',
  'data',
  'events',
  'network',
  'auth',
  'generic',
]);
export type EdgeFlowType = z.infer<typeof EdgeFlowTypeSchema>;

export const StudioEdgeSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  direction: EdgeDirectionSchema.default('sourceToTarget'),
  flowType: EdgeFlowTypeSchema.default('http'),
  label: z.string().optional(),
  animated: z.boolean().default(false),
  style: z.record(z.string(), z.unknown()).optional(),
});
export type StudioEdge = z.infer<typeof StudioEdgeSchema>;

export const DrawingPointSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export type DrawingPoint = z.infer<typeof DrawingPointSchema>;

export const DrawingSchema = z.object({
  id: z.string().min(1),
  points: z.array(DrawingPointSchema),
  strokeWidth: z.number().positive().default(2),
  color: z.string().default('#111827'),
  layer: z.number().default(0),
});
export type Drawing = z.infer<typeof DrawingSchema>;

export const SceneSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  title: z.string().min(1),
  description: z.string().optional(),
  speakerNotes: z.string().optional(),
  viewport: ViewportSchema,
  highlightNodeIds: z.array(z.string()).default([]),
  highlightEdgeIds: z.array(z.string()).default([]),
  animatedEdgeIds: z.array(z.string()).default([]),
});
export type Scene = z.infer<typeof SceneSchema>;

export const ProjectSettingsSchema = z.object({
  snapToGrid: z.boolean().default(false),
  showGrid: z.boolean().default(true),
  reduceMotion: z.boolean().default(false),
});
export type ProjectSettings = z.infer<typeof ProjectSettingsSchema>;

export const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  snapToGrid: false,
  showGrid: true,
  reduceMotion: false,
};

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  schemaVersion: z.number().int().min(1).default(CURRENT_SCHEMA_VERSION),
  catalogVersion: z.string().default('1.0.0'),
  viewport: ViewportSchema.default({ x: 0, y: 0, zoom: 1 }),
  nodes: z.array(StudioNodeSchema).default([]),
  edges: z.array(StudioEdgeSchema).default([]),
  drawings: z.array(DrawingSchema).default([]),
  scenes: z.array(SceneSchema).default([]),
  settings: ProjectSettingsSchema.default(DEFAULT_PROJECT_SETTINGS),
  isFavorite: z.boolean().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ExportedProjectFileSchema = z.object({
  schemaVersion: z.number().int().min(1),
  appVersion: z.string().default('1.0.0'),
  exportedAt: z.string(),
  project: ProjectSchema,
});
export type ExportedProjectFile = z.infer<typeof ExportedProjectFileSchema>;
