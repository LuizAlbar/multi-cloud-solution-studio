import { db, StudioDatabase } from './db';
import { ProjectSchema, type Project, type ProviderId } from '@/lib/schemas';

export interface ProjectSummary {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  nodeCount: number;
  edgeCount: number;
  providers: ProviderId[];
  services: string[];
  isFavorite: boolean;
}

export class StorageQuotaError extends Error {
  constructor(message = 'Cota de armazenamento local excedida.') {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

export class ProjectRepository {
  private database: StudioDatabase;

  constructor(database: StudioDatabase = db) {
    this.database = database;
  }

  async saveProject(project: Project): Promise<void> {
    try {
      const validated = ProjectSchema.parse({
        ...project,
        updatedAt: new Date().toISOString(),
      });
      await this.database.projects.put(validated);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new StorageQuotaError();
      }
      throw error;
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    const raw = await this.database.projects.get(id);
    if (!raw) return undefined;
    return ProjectSchema.parse(raw);
  }

  async listProjects(): Promise<ProjectSummary[]> {
    const all = await this.database.projects.orderBy('updatedAt').reverse().toArray();

    return all.map((proj) => {
      const providerSet = new Set<ProviderId>();
      const serviceSet = new Set<string>();

      proj.nodes.forEach((n) => {
        if (n.providerId) {
          providerSet.add(n.providerId);
        }
        if (n.serviceId) {
          serviceSet.add(n.serviceId);
        }
      });

      return {
        id: proj.id,
        title: proj.title,
        updatedAt: proj.updatedAt,
        createdAt: proj.createdAt,
        nodeCount: proj.nodes.length,
        edgeCount: proj.edges.length,
        providers: Array.from(providerSet),
        services: Array.from(serviceSet),
        isFavorite: Boolean(proj.isFavorite),
      };
    });
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const project = await this.getProject(id);
    if (!project) return false;

    const nextState = !project.isFavorite;
    await this.saveProject({
      ...project,
      isFavorite: nextState,
    });
    return nextState;
  }

  async deleteProject(id: string): Promise<void> {
    await this.database.projects.delete(id);
    await this.database.thumbnails.delete(id);
  }

  async duplicateProject(id: string, newTitle?: string): Promise<Project> {
    const original = await this.getProject(id);
    if (!original) {
      throw new Error(`Projeto com id "${id}" não encontrado para duplicação.`);
    }

    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const duplicated: Project = {
      ...original,
      id: newId,
      title: newTitle || `${original.title} (Cópia)`,
      createdAt: now,
      updatedAt: now,
    };

    await this.saveProject(duplicated);
    return duplicated;
  }

  async saveThumbnail(id: string, dataUrl: string): Promise<void> {
    await this.database.thumbnails.put({
      id,
      updatedAt: new Date().toISOString(),
      dataUrl,
    });
  }

  async getThumbnail(id: string): Promise<string | undefined> {
    const record = await this.database.thumbnails.get(id);
    return record?.dataUrl;
  }
}

export const projectRepository = new ProjectRepository();
