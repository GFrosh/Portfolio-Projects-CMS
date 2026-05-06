import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectFormData } from '../types/project';
import Sheet from '../data/projects/Sheet';

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		let isMounted = true;

		(async () => {
			const loaded = await Sheet.getProjects();
			if (isMounted) {
				setProjects(loaded ?? []);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	const addProject = useCallback((data: ProjectFormData): Project => {
		const now = new Date().toISOString();
		const project: Project = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
		setProjects((prev) => [project, ...prev]);
		Sheet.addProject(project);
		return project;
	}, []);

	const updateProject = useCallback((id: string, data: ProjectFormData): void => {
		const updated = projects.map((p) =>
			p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
		);
		setProjects(updated);
		const project = updated.find((p) => p.id === id);
		if (project) {
			Sheet.updateProject(id, project);
		}
	}, [projects]);

	const deleteProject = useCallback((id: string): void => {
		setProjects((prev) => prev.filter((p) => p.id !== id));
		Sheet.deleteProject(id);
	}, []);

	return { projects, addProject, updateProject, deleteProject };
}
