import {
  ExportedProjectFileSchema,
  ProjectSchema,
  CURRENT_SCHEMA_VERSION,
  type Project,
} from '@/lib/schemas';
import { projectRepository } from '@/lib/storage/project-repository';

export class InvalidProjectFileError extends Error {
  constructor(message = 'Arquivo inválido ou corrompido.') {
    super(message);
    this.name = 'InvalidProjectFileError';
  }
}

export function parseAndValidateProjectFile(content: string): Project {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new InvalidProjectFileError(
      'O arquivo selecionado não contém um JSON válido.'
    );
  }

  // Check if it's the wrapped ExportedProjectFile format
  const exportCheck = ExportedProjectFileSchema.safeParse(parsedJson);
  if (exportCheck.success) {
    if (exportCheck.data.schemaVersion > CURRENT_SCHEMA_VERSION) {
      throw new InvalidProjectFileError(
        `A versão do schema (${exportCheck.data.schemaVersion}) é superior à suportada por esta versão do estúdio (${CURRENT_SCHEMA_VERSION}).`
      );
    }
    return exportCheck.data.project;
  }

  // Fallback: raw Project object
  const projectCheck = ProjectSchema.safeParse(parsedJson);
  if (projectCheck.success) {
    return projectCheck.data;
  }

  // Generate detailed diagnostic message
  const issues = [
    ...(exportCheck.error?.issues || []),
    ...(projectCheck.error?.issues || []),
  ];
  const firstIssue = issues[0]?.message || 'Estrutura do projeto não atende aos requisitos mínimos.';

  throw new InvalidProjectFileError(
    `Arquivo .mcss.json incompatível: ${firstIssue}`
  );
}

export async function importProjectFromJson(content: string): Promise<Project> {
  const sourceProject = parseAndValidateProjectFile(content);

  // Always import as a new project with fresh ID and timestamps (RF-16, CA-09)
  const newId = `proj-imported-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const importedProject: Project = {
    ...sourceProject,
    id: newId,
    title: `${sourceProject.title} (Importado)`,
    createdAt: now,
    updatedAt: now,
  };

  await projectRepository.saveProject(importedProject);
  return importedProject;
}
