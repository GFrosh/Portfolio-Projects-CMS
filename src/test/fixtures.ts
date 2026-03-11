import type { Project, ProjectFormData } from '../types/project'

export const sampleProjectFormData: ProjectFormData = {
  title: 'Alpha',
  description: 'Alpha description',
  longDescription: 'Alpha long description',
  tags: ['react', 'vite'],
  githubUrl: 'https://github.com/example/alpha',
  demoUrl: 'https://example.com/alpha',
  imageUrl: 'https://example.com/alpha.png',
  status: 'draft',
  featured: false,
}

export const sampleProject: Project = {
  ...sampleProjectFormData,
  id: 'project-1',
  createdAt: '2026-03-11T10:00:00.000Z',
  updatedAt: '2026-03-11T10:00:00.000Z',
}