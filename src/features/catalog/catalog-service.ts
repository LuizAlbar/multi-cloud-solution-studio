import rawCatalog from '@/data/service-catalog.json';
import {
  CatalogDatabaseSchema,
  type CatalogService,
  type ProviderId,
  type ServiceCategory,
} from '@/lib/schemas';

// Parse and validate catalog at module load time
const catalogData = CatalogDatabaseSchema.parse(rawCatalog);

export const PROVIDERS: { id: ProviderId; name: string }[] = [
  { id: 'gcp', name: 'Google Cloud' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Microsoft Azure' },
  { id: 'oci', name: 'Oracle Cloud (OCI)' },
  { id: 'cloudflare', name: 'Cloudflare' },
  { id: 'hostinger', name: 'Hostinger' },
  { id: 'supabase', name: 'Supabase' },
  { id: 'custom', name: 'Custom / On-Prem' },
];

export const CATEGORIES: { id: ServiceCategory; name: string }[] = [
  { id: 'compute', name: 'Compute / Containers' },
  { id: 'storage', name: 'Storage' },
  { id: 'databases', name: 'Databases' },
  { id: 'networking', name: 'Networking / Edge' },
  { id: 'analytics', name: 'Data / Analytics' },
  { id: 'ai-ml', name: 'AI / ML' },
  { id: 'security', name: 'Identity / Security' },
  { id: 'integration', name: 'Integration / Messaging' },
  { id: 'custom', name: 'Custom / Legacy' },
];

export function getCatalogServices(): CatalogService[] {
  return catalogData.services;
}

export function getCatalogServiceById(id: string): CatalogService | undefined {
  return catalogData.services.find((s) => s.serviceId === id);
}

export function searchCatalog(
  query: string,
  filters?: {
    provider?: ProviderId;
    category?: ServiceCategory;
  }
): CatalogService[] {
  const normalizedQuery = query.trim().toLowerCase();

  return catalogData.services.filter((service) => {
    if (filters?.provider && service.providerId !== filters.provider) {
      return false;
    }

    if (filters?.category && service.category !== filters.category) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const nameMatch = service.displayName.toLowerCase().includes(normalizedQuery);
    const aliasMatch = service.aliases.some((alias) =>
      alias.toLowerCase().includes(normalizedQuery)
    );
    const tagMatch = service.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );
    const providerMatch = service.providerId.toLowerCase().includes(normalizedQuery);
    const categoryMatch = service.category.toLowerCase().includes(normalizedQuery);

    return nameMatch || aliasMatch || tagMatch || providerMatch || categoryMatch;
  });
}
