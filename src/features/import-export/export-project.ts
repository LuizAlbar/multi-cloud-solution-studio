import {
  ProjectSchema,
  ExportedProjectFileSchema,
  CURRENT_SCHEMA_VERSION,
  type Project,
  type ExportedProjectFile,
} from '@/lib/schemas';

export function createExportPayload(project: Project): ExportedProjectFile {
  const validatedProject = ProjectSchema.parse(project);

  const payload: ExportedProjectFile = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    appVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    project: validatedProject,
  };

  return ExportedProjectFileSchema.parse(payload);
}

export function exportProjectToJson(project: Project): void {
  const payload = createExportPayload(project);
  const jsonString = JSON.stringify(payload, null, 2);

  const sanitizedTitle = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${sanitizedTitle || 'projeto'}-${dateStr}.mcss.json`;

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
