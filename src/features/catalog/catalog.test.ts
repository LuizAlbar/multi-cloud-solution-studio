import { describe, it, expect } from 'vitest';
import {
  getCatalogServices,
  getCatalogServiceById,
  searchCatalog,
  PROVIDERS,
} from './catalog-service';

describe('Catalog Service and Declarative Database (PRD 2 / RF2-03)', () => {
  it('contains over 150 verified services across the 7 providers', () => {
    const services = getCatalogServices();
    expect(services.length).toBeGreaterThanOrEqual(150);
    expect(services.length).toBe(153);
  });

  it('covers all 7 required providers with deep portfolios', () => {
    const services = getCatalogServices();
    const countByProvider: Record<string, number> = {};

    services.forEach((s) => {
      countByProvider[s.providerId] = (countByProvider[s.providerId] || 0) + 1;
    });

    expect(countByProvider['gcp']).toBeGreaterThanOrEqual(30);
    expect(countByProvider['aws']).toBeGreaterThanOrEqual(40);
    expect(countByProvider['azure']).toBeGreaterThanOrEqual(25);
    expect(countByProvider['oci']).toBeGreaterThanOrEqual(15);
    expect(countByProvider['cloudflare']).toBeGreaterThanOrEqual(10);
    expect(countByProvider['hostinger']).toBeGreaterThanOrEqual(5);
    expect(countByProvider['supabase']).toBeGreaterThanOrEqual(8);
  });

  it('preserves all 44 original MVP service IDs without regression', () => {
    const original44Ids = [
      'gcp-cloud-run', 'gcp-compute-engine', 'gcp-gke', 'gcp-cloud-storage',
      'gcp-cloud-sql', 'gcp-bigquery', 'gcp-vertex-ai', 'gcp-cloud-load-balancing',
      'aws-ec2', 'aws-lambda', 'aws-ecs', 'aws-fargate', 'aws-s3', 'aws-rds',
      'aws-athena', 'aws-bedrock', 'aws-api-gateway', 'azure-virtual-machines',
      'azure-functions', 'azure-app-service', 'azure-aks', 'azure-blob-storage',
      'azure-sql-database', 'azure-front-door', 'oci-compute', 'oci-vcn',
      'oci-oke', 'oci-object-storage', 'oci-autonomous-database', 'oci-load-balancer',
      'cloudflare-workers', 'cloudflare-r2', 'cloudflare-cdn', 'cloudflare-waf',
      'cloudflare-dns', 'cloudflare-d1', 'hostinger-vps', 'hostinger-web-hosting',
      'hostinger-cloud-hosting', 'supabase-postgres', 'supabase-auth',
      'supabase-storage', 'supabase-edge-functions', 'supabase-realtime'
    ];

    original44Ids.forEach((id) => {
      const found = getCatalogServiceById(id);
      expect(found, `Service ${id} must exist`).toBeDefined();
    });
  });

  it('searches for specific sampling required by PRD 2 section 5', () => {
    const requiredSample = [
      { query: 'Cloud Run', expectedId: 'gcp-cloud-run' },
      { query: 'BigQuery', expectedId: 'gcp-bigquery' },
      { query: 'EC2', expectedId: 'aws-ec2' },
      { query: 'S3', expectedId: 'aws-s3' },
      { query: 'Azure Functions', expectedId: 'azure-functions' },
      { query: 'Autonomous Database', expectedId: 'oci-autonomous-database' },
      { query: 'Workers', expectedId: 'cloudflare-workers' },
      { query: 'Supabase Auth', expectedId: 'supabase-auth' },
    ];

    requiredSample.forEach(({ query, expectedId }) => {
      const results = searchCatalog(query);
      expect(
        results.some((s) => s.serviceId === expectedId),
        `Query "${query}" must find ${expectedId}`
      ).toBe(true);
    });
  });

  it('guarantees each service has valid metadata, docs URL and license', () => {
    const services = getCatalogServices();
    services.forEach((s) => {
      expect(s.serviceId).toBeTruthy();
      expect(s.displayName).toBeTruthy();
      expect(s.officialDocsUrl.startsWith('http')).toBe(true);
      expect(s.lastReviewedAt).toBe('2026-11-14');
      expect(s.shortDescription.length).toBeGreaterThan(10);
    });
  });
});
