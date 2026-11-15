import Dexie, { type Table } from 'dexie';
import type { Project } from '@/lib/schemas';

export interface StoredThumbnail {
  id: string;
  updatedAt: string;
  dataUrl: string;
}

export class StudioDatabase extends Dexie {
  projects!: Table<Project, string>;
  thumbnails!: Table<StoredThumbnail, string>;

  constructor(databaseName = 'MultiCloudSolutionStudioDB') {
    super(databaseName);
    this.version(1).stores({
      projects: '&id, title, updatedAt, createdAt',
      thumbnails: '&id, updatedAt',
    });
  }
}

export const db = new StudioDatabase();
