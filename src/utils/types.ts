export type ProjectStatus = 'draft' | 'published' | 'archived';
export type FilterStatus = 'all' | ProjectStatus;
export type SortField = 'title' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';


export interface ProjectRow {
	id: number;
	user_id: number;
	title: string;
	description: string | null;
	github_url: string | null;
	demo_url: string | null;
	image_url: string | null;
	tags: string[] | null;
	status: ProjectStatus;
	featured: boolean;
	created_at: string;
}


export interface Project {
	id: number;
	userId: number;
	title: string;
	shortDescription: string;
	description?: string;
	tags: string[];
	githubUrl: string | null;
	demoUrl: string | null;
	imageUrl: string | null;
	status: ProjectStatus;
	featured: boolean;
	createdAt: string;
	updated_at: string;
}


export interface ProjectFormData {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  imageUrl: string;
  status: ProjectStatus;
  featured: boolean;
}


export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export type ModalMode =
  | { type: 'create' }
  | { type: 'edit'; project: any }
  | { type: 'view'; project: any }
  | { type: 'delete'; projectId: string; title: string };
