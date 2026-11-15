import { type Project } from '@/lib/schemas';
import { projectRepository } from '@/lib/storage/project-repository';
import {
  validateMCSSDiagramJson,
  sanitizePastedJson,
} from '@/features/diagram-format/validation/validator';
import {
  deserializeFromMCSS,
  adaptLegacyProjectToMCSS,
} from '@/features/diagram-format/serialization/serializer';

export class InvalidProjectFileError extends Error {
  constructor(message = 'Arquivo inválido ou corrompido.') {
    super(message);
    this.name = 'InvalidProjectFileError';
  }
}

export function parseAndValidateProjectFile(content: string): Project {
  const cleaned = sanitizePastedJson(content);

  // 1. Try modern canonical MCSS validation
  const report = validateMCSSDiagramJson(cleaned);
  if (report.isValid && report.document) {
    return deserializeFromMCSS(report.document);
  }

  // 2. Fallback: try legacy adaptation (pre-PRD 5 formats)
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const syntaxIssue = report.issues.find((i) => i.code === 'INVALID_JSON');
    throw new InvalidProjectFileError(
      syntaxIssue?.message || 'O arquivo selecionado não contém um JSON válido.'
    );
  }

  const legacyAdapted = adaptLegacyProjectToMCSS(parsed);
  if (legacyAdapted) {
    return deserializeFromMCSS(legacyAdapted);
  }

  // 3. Return specific first error message
  const firstIssue = report.issues[0];
  const diagnostic = firstIssue
    ? `${firstIssue.message} (em ${firstIssue.path})`
    : 'Estrutura do diagrama não atende aos requisitos mínimos.';

  throw new InvalidProjectFileError(
    `Arquivo .mcss.json incompatível: ${diagnostic}`
  );
}

export async function importProjectFromJson(content: string): Promise<Project> {
  const sourceProject = parseAndValidateProjectFile(content);

  // Always import as a new project with fresh ID and timestamps (RF-16, CA-09, CA5-16)
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
