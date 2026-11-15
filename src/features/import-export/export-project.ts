import { type Project } from '@/lib/schemas';
import {
  serializeToMCSS,
} from '@/features/diagram-format/serialization/serializer';
import type { MCSSDiagramDocument } from '@/features/diagram-format/domain/diagram-format';

export function createExportPayload(project: Project): MCSSDiagramDocument {
  return serializeToMCSS(project, 'export');
}

export function exportProjectToJson(project: Project): void {
  const payload = createExportPayload(project);
  const jsonString = JSON.stringify(payload, null, 2);

  const sanitizedTitle = project.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${sanitizedTitle || 'diagrama'}-${dateStr}.mcss.json`;

  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
