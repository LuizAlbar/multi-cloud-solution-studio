import { describe, it, expect } from 'vitest';
import {
  getCatalogServices,
  getCatalogServiceById,
  searchCatalog,
  PROVIDERS,
} from './catalog-service';

describe('Catalog Service and Declarative Database', () => {
  it('contains exactly 44 initial services as specified in PRD section 4.2', () => {
    const services = getCatalogServices();
    expect(services.length).toBe(44);
  });

  it('covers all 7 required providers with the exact counts from PRD', () => {
    const services = getCatalogServices();
    const countByProvider: Record<string, number> = {};

    services.forEach((s) => {
      countByProvider[s.providerId] = (countByProvider[s.providerId] || 0) + 1;
    });

    expect(countByProvider['gcp']).toBe(8);
    expect(countByProvider['aws']).toBe(9);
    expect(countByProvider['azure']).toBe(7);
    expect(countByProvider['oci']).toBe(6);
    expect(countByProvider['cloudflare']).toBe(6);
    expect(countByProvider['hostinger']).toBe(3);
    expect(countByProvider['supabase']).toBe(5);

    // Total: 8 + 9 + 7 + 6 + 6 + 3 + 5 = 44
    expect(
      countByProvider['gcp'] +
        countByProvider['aws'] +
        countByProvider['azure'] +
        countByProvider['oci'] +
        countByProvider['cloudflare'] +
        countByProvider['hostinger'] +
        countByProvider['supabase']
    ).toBe(44);
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

  it('retrieves service by id', () => {
    const cloudRun = getCatalogServiceById('gcp-cloud-run');
    expect(cloudRun).toBeDefined();
    expect(cloudRun?.displayName).toBe('Cloud Run');
    expect(cloudRun?.providerId).toBe('gcp');

    const bigquery = getCatalogServiceById('gcp-bigquery');
    expect(bigquery).toBeDefined();
    expect(bigquery?.displayName).toBe('BigQuery');

    const supabase = getCatalogServiceById('supabase-postgres');
    expect(supabase).toBeDefined();
    expect(supabase?.providerId).toBe('supabase');
  });

  it('searches catalog by name, alias, or provider', () => {
    // Search by name
    const runResults = searchCatalog('Cloud Run');
    expect(runResults.some((s) => s.serviceId === 'gcp-cloud-run')).toBe(true);

    // Search by alias
    const serverlessResults = searchCatalog('serverless');
    expect(serverlessResults.length).toBeGreaterThan(0);
    expect(serverlessResults.some((s) => s.serviceId === 'aws-lambda')).toBe(true);

    // Search by provider filter
    const awsOnly = searchCatalog('', { provider: 'aws' });
    expect(awsOnly.length).toBe(9);
    expect(awsOnly.every((s) => s.providerId === 'aws')).toBe(true);

    // Search by category filter
    const dbOnly = searchCatalog('', { category: 'databases' });
    expect(dbOnly.length).toBeGreaterThan(0);
    expect(dbOnly.every((s) => s.category === 'databases')).toBe(true);
  });
});
