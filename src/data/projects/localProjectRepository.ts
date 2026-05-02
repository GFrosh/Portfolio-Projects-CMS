import type { Project } from '../../types/project';

const STORAGE_KEY = 'portfolio_cms_projects';

export interface ProjectRepository {
	loadProjects(): Project[];
	saveProjects(projects: Project[]): void;
}

export class LocalProjectRepository implements ProjectRepository {
	loadProjects(): Project[] {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return [];
			return JSON.parse(raw) as Project[];
		} catch {
			return [];
		}
	}

	saveProjects(projects: Project[]): void {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
	}
}

export const projectRepository: ProjectRepository = new LocalProjectRepository();
