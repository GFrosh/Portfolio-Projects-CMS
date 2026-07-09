'use client';

import Portal from '@/data/auth/Portal';
import type { Project } from '@/types/project';

type ApiProject = {
  id: string | number;
  title?: string;
  name?: string;
  description?: string;
  long_description?: string;
  longDescription?: string;
  tags?: unknown[];
  github_url?: string;
  githubUrl?: string;
  demo_url?: string;
  demoUrl?: string;
  image_url?: string;
  imageUrl?: string;
  status?: string;
  featured?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
};

/**
 * Sheet: REST client for /api/projects.
 * All persistence lives on the backend; UI state is transient.
 */
export default class Sheet {
  static baseUrl: string = Portal.BASE_URL;

  private static mapApiProject(api: ApiProject): Project {
    return {
      id: String(api.id),
      title: api.title ?? api.name ?? '',
      description: api.description ?? '',
      longDescription: api.long_description ?? api.longDescription ?? '',
      tags: Array.isArray(api.tags) ? api.tags.map(String) : [],
      githubUrl: api.github_url ?? api.githubUrl ?? '',
      demoUrl: api.demo_url ?? api.demoUrl ?? '',
      imageUrl: api.image_url ?? api.imageUrl ?? '',
      status: (api.status as Project['status']) ?? 'draft',
      featured: Boolean(api.featured),
      createdAt: api.created_at ?? api.createdAt ?? new Date().toISOString(),
      updatedAt: api.updated_at ?? api.updatedAt ?? new Date().toISOString(),
    };
  }

  static async getProjects(): Promise<Project[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/projects`);
      if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
      const body: unknown = await res.json();

      let items: ApiProject[] | undefined;
      if (Array.isArray(body)) items = body as ApiProject[];
      else if (body && typeof body === 'object') {
        const b = body as Record<string, unknown>;
        if (Array.isArray(b.data)) items = b.data as ApiProject[];
        else if (Array.isArray(b.projects)) items = b.projects as ApiProject[];
        else if (Array.isArray(b.items)) items = b.items as ApiProject[];
      }
      if (!items) throw new Error('Unexpected projects payload shape');
      return items.map((i) => this.mapApiProject(i));
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return null;
    }
  }

  static async addProject(project: Project): Promise<Project | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error(`Failed to create project: ${res.status}`);
      const created: unknown = await res.json();
      const wrapped =
        (created as { data?: unknown })?.data ?? created ?? null;
      if (!wrapped) return null;
      const obj = Array.isArray(wrapped)
        ? (wrapped[0] as ApiProject)
        : (wrapped as ApiProject);
      return this.mapApiProject(obj);
    } catch (error) {
      console.error('Failed to add project:', error);
      return null;
    }
  }

  static async updateProject(
    id: string,
    project: Project,
  ): Promise<Project | null> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/projects/edit/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project),
        },
      );
      if (!res.ok) throw new Error(`Failed to update project: ${res.status}`);
      const updated: unknown = await res.json();
      const wrapped =
        (updated as { data?: unknown })?.data ?? updated ?? null;
      if (!wrapped) return null;
      return this.mapApiProject(
        Array.isArray(wrapped)
          ? (wrapped[0] as ApiProject)
          : (wrapped as ApiProject),
      );
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      return null;
    }
  }

  static async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(
        `${this.baseUrl}/api/projects/delete/${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error(`Failed to delete project: ${res.status}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      return false;
    }
  }
}
