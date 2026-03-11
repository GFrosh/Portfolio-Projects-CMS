export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  imageUrl: string;
  status: ProjectStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export type SortField = 'updatedAt' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';
export type FilterStatus = 'all' | ProjectStatus;
