import { z } from 'zod';

export const ProviderIdSchema = z.enum([
  'gcp',
  'aws',
  'azure',
  'oci',
  'cloudflare',
  'hostinger',
  'supabase',
  'custom',
]);
export type ProviderId = z.infer<typeof ProviderIdSchema>;

export const ServiceCategorySchema = z.enum([
  'compute',
  'storage',
  'databases',
  'networking',
  'analytics',
  'ai-ml',
  'security',
  'integration',
  'custom',
]);
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;

export const CatalogServiceSchema = z.object({
  serviceId: z.string().min(1),
  providerId: ProviderIdSchema,
  displayName: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  category: ServiceCategorySchema,
  tags: z.array(z.string()).default([]),
  iconKey: z.string().min(1),
  assetLicense: z.string().default('Official vendor guidelines'),
  shortDescription: z.string(),
  officialDocsUrl: z.string().url(),
  lastReviewedAt: z.string().min(1),
  propertiesSchema: z.record(z.string(), z.unknown()).optional(),
  connectionHints: z.array(z.string()).optional(),
  limitationsNotes: z.array(z.string()).optional(),
});
export type CatalogService = z.infer<typeof CatalogServiceSchema>;

export const CatalogDatabaseSchema = z.object({
  version: z.string(),
  updatedAt: z.string(),
  services: z.array(CatalogServiceSchema),
});
export type CatalogDatabase = z.infer<typeof CatalogDatabaseSchema>;
