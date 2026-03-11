import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectFormData } from '../types/project';
import { loadProjects, saveProjects } from '../utils/storage';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(loadProjects);

  const persist = useCallback((updated: Project[]) => {
    setProjects(updated);
    saveProjects(updated);
  }, []);

  const addProject = useCallback((data: ProjectFormData): Project => {
    const now = new Date().toISOString();
    const project: Project = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
    persist([project, ...projects]);
    return project;
  }, [projects, persist]);

  const updateProject = useCallback((id: string, data: ProjectFormData): void => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    persist(updated);
  }, [projects, persist]);

  const deleteProject = useCallback((id: string): void => {
    persist(projects.filter((p) => p.id !== id));
  }, [projects, persist]);

  return { projects, addProject, updateProject, deleteProject };
}
