'use client';

import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectFormData } from '@/types/project';
import Sheet from '@/data/projects/Sheet';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const loaded = await Sheet.getProjects();
      if (!isMounted) return;
      if (loaded === null) {
        setError('Failed to load projects from server.');
        setProjects([]);
      } else {
        setError(null);
        setProjects(loaded);
      }
      setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const addProject = useCallback((data: ProjectFormData): Project => {
    const now = new Date().toISOString();
    const project: Project = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setProjects((prev) => [project, ...prev]);
    setError(null);
    Sheet.addProject(project).catch((err) => {
      console.error('Failed to create project:', err);
      setError('Failed to save project. Please try again.');
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    });
    return project;
  }, []);

  const updateProject = useCallback(
    (id: string, data: ProjectFormData): void => {
      setProjects((prev) => {
        const updated = prev.map((p) =>
          p.id === id
            ? { ...p, ...data, updatedAt: new Date().toISOString() }
            : p,
        );
        const target = updated.find((p) => p.id === id);
        if (target) {
          Sheet.updateProject(id, target).catch((err) => {
            console.error('Failed to update project:', err);
            setError('Failed to update project. Please try again.');
            setProjects(prev);
          });
        }
        return updated;
      });
      setError(null);
    },
    [],
  );

  const deleteProject = useCallback((id: string): void => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      Sheet.deleteProject(id).catch((err) => {
        console.error('Failed to delete project:', err);
        setError('Failed to delete project. Please try again.');
        setProjects(prev);
      });
      return next;
    });
    setError(null);
  }, []);

  return { projects, loading, error, addProject, updateProject, deleteProject };
}
