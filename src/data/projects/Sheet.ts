import Portal from "../auth/Portal";
import type { Project } from "../../types/project";

const STORAGE_KEY = 'portfolio_cms_projects';

export default class Sheet {
	static baseUrl: string = Portal.BASE_URL;

	// Try to load projects from a backend endpoint; if it fails, fall back to localStorage.
	static async getProjects(): Promise<Project[]> {
		try {
			const res = await fetch(`${this.baseUrl}/api/projects`);
			if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
			const data = await res.json();

			// Normalize a few common shapes: array, { projects: [...] }, { items: [...] }
			if (Array.isArray(data)) return data as Project[];
			if (data && Array.isArray((data as any).projects)) return (data as any).projects as Project[];
			if (data && Array.isArray((data as any).items)) return (data as any).items as Project[];

			// Unknown shape, fall back to local storage
			throw new Error('Unexpected projects payload shape');
		} catch (error) {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (!raw) return [];
				return JSON.parse(raw) as Project[];
			} catch {
				return [];
			}
		}
	}

	// Create a new project (POST).
	static async addProject(project: Project): Promise<boolean> {
		try {
			// Always persist locally first so the UI stays responsive.
			const all = await this.getProjects();
			const updated = [project, ...all];
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

			// Try to sync with backend if endpoint exists.
			try {
				const res = await fetch(`${this.baseUrl}/api/projects/new`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(project)
				});
				if (!res.ok) {
					// backend not available or rejected; treat as non-fatal
					return false;
				}
				return true;
			} catch {
				return false;
			}
		} catch (error) {
			console.error('Failed to add project locally:', error);
			return false;
		}
	}

	// Update a single project by ID (PUT).
	static async updateProject(id: string, project: Project): Promise<boolean> {
		try {
			// Update locally first.
			const all = await this.getProjects();
			const updated = all.map((p) => (p.id === id ? project : p));
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

			// Try to sync with backend if endpoint exists.
			try {
				const res = await fetch(`${this.baseUrl}/api/projects/edit/${encodeURIComponent(id)}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(project)
				});
				if (!res.ok) {
					// backend not available or rejected; treat as non-fatal
					return false;
				}
				return true;
			} catch {
				return false;
			}
		} catch (error) {
			console.error(`Failed to update project ${id}:`, error);
			return false;
		}
	}

	// Delete a single project by ID (DELETE).
	static async deleteProject(id: string): Promise<boolean> {
		try {
			// Delete locally first.
			const all = await this.getProjects();
			const updated = all.filter((p) => p.id !== id);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

			// Try to sync with backend if endpoint exists.
			try {
				const res = await fetch(`${this.baseUrl}/api/projects/delete/${encodeURIComponent(id)}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				if (!res.ok) {
					// backend not available or rejected; treat as non-fatal
					return false;
				}
				return true;
			} catch {
				return false;
			}
		} catch (error) {
			console.error(`Failed to delete project ${id}:`, error);
			return false;
		}
	}
}
