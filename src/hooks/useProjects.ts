import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectFormData } from '../types/project';
import Sheet from '../data/projects/Sheet';

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		(async () => {
			setLoading(true);
			const loaded = await Sheet.getProjects();
			if (isMounted) {
				if (loaded === null) {
					setError('Failed to load projects from server.');
					setProjects([]);
				} else {
					setError(null);
					setProjects(loaded);
				}
				setLoading(false);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	const addProject = useCallback((data: ProjectFormData): Project | null => {
		const now = new Date().toISOString();
		const project: Project = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
		
		// Optimistic UI update
		setProjects((prev) => [project, ...prev]);
		setError(null);

		// Sync to backend
		Sheet.addProject(project).catch((err) => {
			console.error('Failed to create project:', err);
			setError('Failed to save project. Please try again.');
			// Revert optimistic update on failure
			setProjects((prev) => prev.filter((p) => p.id !== project.id));
		});

		return project;
	}, []);

	const updateProject = useCallback((id: string, data: ProjectFormData): void => {
		const updated = projects.map((p) =>
			p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
		);
		
		// Optimistic UI update
		setProjects(updated);
		setError(null);

		const project = updated.find((p) => p.id === id);
		if (project) {
			// Sync to backend
			Sheet.updateProject(id, project).catch((err) => {
				console.error('Failed to update project:', err);
				setError('Failed to update project. Please try again.');
				// Revert to previous state on failure
				setProjects(projects);
			});
		}
	}, [projects]);

	const deleteProject = useCallback((id: string): void => {
		const previous = projects;
		
		// Optimistic UI update
		setProjects((prev) => prev.filter((p) => p.id !== id));
		setError(null);

		// Sync to backend
		Sheet.deleteProject(id).catch((err) => {
			console.error('Failed to delete project:', err);
			setError('Failed to delete project. Please try again.');
			// Revert to previous state on failure
			setProjects(previous);
		});
	}, [projects]);

	return { projects, loading, error, addProject, updateProject, deleteProject };
}
