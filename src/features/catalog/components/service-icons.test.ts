import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { OFFICIAL_SVG_MAP } from './service-icons';

describe('Service Icons Library from assets/cloud-icons-library', () => {
  it('maps over 70 cloud services directly to official local vendor SVGs', () => {
    const keys = Object.keys(OFFICIAL_SVG_MAP);
    expect(keys.length).toBeGreaterThanOrEqual(70);
  });

  it('guarantees every single mapped SVG file exists on disk in public/', () => {
    let missingCount = 0;
    for (const [serviceId, svgPath] of Object.entries(OFFICIAL_SVG_MAP)) {
      const fullPath = path.join(process.cwd(), 'public', svgPath);
      const exists = fs.existsSync(fullPath);
      if (!exists) {
        console.error(`Missing SVG file for ${serviceId}: ${fullPath}`);
        missingCount++;
      }
    }
    expect(missingCount).toBe(0);
  });

  it('contains verified official SVGs for flagship services across GCP, AWS, and Azure', () => {
    expect(OFFICIAL_SVG_MAP['gcp-cloud-run']).toBe('/cloud-icons/gcp-icons/Cloud-Run.svg');
    expect(OFFICIAL_SVG_MAP['gcp-bigquery']).toBe('/cloud-icons/gcp-icons/BigQuery.svg');
    expect(OFFICIAL_SVG_MAP['aws-ec2']).toBe('/cloud-icons/aws-icons/Compute/EC2.svg');
    expect(OFFICIAL_SVG_MAP['aws-lambda']).toBe('/cloud-icons/aws-icons/Compute/Lambda.svg');
    expect(OFFICIAL_SVG_MAP['aws-s3']).toBe('/cloud-icons/aws-icons/Storage/Simple-Storage-Service.svg');
    expect(OFFICIAL_SVG_MAP['azure-virtual-machines']).toBe('/cloud-icons/azure-icons/Icons/compute/10021-icon-service-Virtual-Machine.svg');
    expect(OFFICIAL_SVG_MAP['azure-functions']).toBe('/cloud-icons/azure-icons/Icons/compute/10029-icon-service-Function-Apps.svg');
  });
});
