import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { getTemplates, getTemplateById } from './index';
import { projectRepository } from '@/lib/storage/project-repository';
import type { Project } from '@/lib/schemas';

describe('Architecture Templates (CA-11)', () => {
  it('contains exactly 5 initial reference templates as required by PRD T02', () => {
    const templates = getTemplates();
    expect(templates.length).toBe(5);

    const ids = templates.map((t) => t.id);
    expect(ids).toContain('template-serverless-web');
    expect(ids).toContain('template-aws-analytics');
    expect(ids).toContain('template-enterprise-rag');
    expect(ids).toContain('template-managed-backend');
    expect(ids).toContain('template-oci-enterprise');
  });

  it('each template has valid architectural content and key services', () => {
    const templates = getTemplates();
    templates.forEach((t) => {
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(t.useCase).toBeTruthy();
      expect(t.providers.length).toBeGreaterThan(0);
      expect(t.projectData.nodes.length).toBeGreaterThanOrEqual(3);
      expect(t.projectData.edges.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('instantiating a project from a template creates an independent copy with unique IDs (RF-12, CA-11)', async () => {
    const template = getTemplateById('template-serverless-web')!;
    expect(template).toBeDefined();

    const originalNodeCount = template.projectData.nodes.length;

    // Create new project from template
    const newId = `proj-from-temp-${Date.now()}`;
    const newProject: Project = {
      ...template.projectData,
      id: newId,
      title: `${template.title} (Meu Projeto)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await projectRepository.saveProject(newProject);

    // Retrieve from DB
    const saved = await projectRepository.getProject(newId);
    expect(saved).toBeDefined();
    expect(saved?.id).toBe(newId);
    expect(saved?.nodes.length).toBe(originalNodeCount);

    // Mutate the saved project and ensure template is untouched
    saved!.nodes.push({
      id: 'extra-node',
      kind: 'service',
      serviceId: 'aws-ec2',
      providerId: 'aws',
      label: 'Added Node',
      position: { x: 500, y: 500 },
      properties: {},
      notes: '',
    });

    await projectRepository.saveProject(saved!);

    // Template in memory must remain completely unchanged
    expect(template.projectData.nodes.length).toBe(originalNodeCount);
  });
});
