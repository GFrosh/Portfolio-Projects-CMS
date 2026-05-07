import Portal from "../auth/Portal";
import type { Project } from "../../types/project";

/**
 * Sheet: Backend-first API client for project management.
 * All data is stored on the server; React state is transient.
 * Network errors are propagated to the caller for UI handling.
 */
export default class Sheet {
	static baseUrl: string = Portal.BASE_URL;

	private static mapApiProject(api: any): Project {
		return {
			id: String(api.id),
			title: api.title ?? api.name ?? '',
			description: api.description ?? '',
			longDescription: api.long_description ?? api.longDescription ?? '',
			tags: Array.isArray(api.tags) ? api.tags.map(String) : [],
			githubUrl: api.github_url ?? api.githubUrl ?? '',
			demoUrl: api.demo_url ?? api.demoUrl ?? '',
			imageUrl: api.image_url ?? api.imageUrl ?? '',
			status: (api.status as any) ?? 'draft',
			featured: Boolean(api.featured),
			createdAt: api.created_at ?? api.createdAt ?? new Date().toISOString(),
			updatedAt: api.updated_at ?? api.updatedAt ?? new Date().toISOString(),
		};
	}

	// Try to load projects from the backend. Network errors propagate to caller.
	static async getProjects(): Promise<Project[] | null> {
		try {
			const res = await fetch(`${this.baseUrl}/api/projects`);
			if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
			const body = await res.json();

			let items: any[] | undefined;
			if (Array.isArray(body)) items = body;
			else if (body && Array.isArray((body as any).data)) items = (body as any).data;
			else if (body && Array.isArray((body as any).projects)) items = (body as any).projects;
			else if (body && Array.isArray((body as any).items)) items = (body as any).items;

			if (!items) throw new Error('Unexpected projects payload shape');

			return items.map((i) => this.mapApiProject(i));
		} catch (error) {
			console.error('Failed to fetch projects:', error);
			return null;
		}
	}

	// Create a new project (POST). Returns created project or null on error.
	static async addProject(project: Project): Promise<Project | null> {
		try {
			const res = await fetch(`${this.baseUrl}/api/projects`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(project)
			});
			if (!res.ok) {
				throw new Error(`Failed to create project: ${res.status}`);
			}
			const created = await res.json();
			// created may be wrapped or use snake_case
			const item = created?.data ?? created ?? null;
			if (!item) return null;
			// If backend returned wrapper with data array, pick first
			const obj = Array.isArray(item) ? item[0] : item;
			return this.mapApiProject(obj);
		} catch (error) {
			console.error('Failed to add project:', error);
			return null;
		}
	}

	// Update a single project by ID (PUT). Returns updated project or null on error.
	static async updateProject(id: string, project: Project): Promise<Project | null> {
		try {
			const res = await fetch(`${this.baseUrl}/api/projects/edit/${encodeURIComponent(id)}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(project)
			});
			if (!res.ok) {
				throw new Error(`Failed to update project: ${res.status}`);
			}
			const updated = await res.json();
			const obj = updated?.data ?? updated ?? null;
			if (!obj) return null;
			return this.mapApiProject(Array.isArray(obj) ? obj[0] : obj);
		} catch (error) {
			console.error(`Failed to update project ${id}:`, error);
			return null;
		}
	}

	// Delete a single project by ID (DELETE). Returns true on success, false on error.
	static async deleteProject(id: string): Promise<boolean> {
		try {
			const res = await fetch(`${this.baseUrl}/api/projects/delete/${encodeURIComponent(id)}`, {
				method: 'DELETE'
			});
			if (!res.ok) {
				throw new Error(`Failed to delete project: ${res.status}`);
			}
			return true;
		} catch (error) {
			console.error(`Failed to delete project ${id}:`, error);
			return false;
		}
	}
}
