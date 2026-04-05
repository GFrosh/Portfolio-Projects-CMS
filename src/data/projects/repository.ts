import type { Project } from '../../types/project';

export interface ProjectRepository {
  loadProjects(): Project[];
  saveProjects(projects: Project[]): void;
}
