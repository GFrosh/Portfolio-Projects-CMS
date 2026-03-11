import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useProjects } from './useProjects'
import { sampleProject, sampleProjectFormData } from '../test/fixtures'

vi.mock('uuid', () => ({
  v4: () => 'generated-id',
}))

describe('useProjects', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads initial projects from localStorage', () => {
    localStorage.setItem('portfolio_cms_projects', JSON.stringify([sampleProject]))

    const { result } = renderHook(() => useProjects())

    expect(result.current.projects).toEqual([sampleProject])
  })

  it('adds a project and persists it', () => {
    const { result } = renderHook(() => useProjects())

    act(() => {
      result.current.addProject(sampleProjectFormData)
    })

    expect(result.current.projects).toHaveLength(1)
    expect(result.current.projects[0]).toMatchObject({
      ...sampleProjectFormData,
      id: 'generated-id',
    })
    expect(JSON.parse(localStorage.getItem('portfolio_cms_projects') ?? '[]')).toHaveLength(1)
  })

  it('updates an existing project and refreshes the timestamp', () => {
    localStorage.setItem('portfolio_cms_projects', JSON.stringify([sampleProject]))

    const { result } = renderHook(() => useProjects())

    act(() => {
      result.current.updateProject(sampleProject.id, {
        ...sampleProjectFormData,
        title: 'Beta',
        featured: true,
      })
    })

    expect(result.current.projects[0].title).toBe('Beta')
    expect(result.current.projects[0].featured).toBe(true)
    expect(result.current.projects[0].updatedAt).not.toBe(sampleProject.updatedAt)
  })

  it('deletes a project and persists the remaining list', () => {
    localStorage.setItem('portfolio_cms_projects', JSON.stringify([sampleProject]))

    const { result } = renderHook(() => useProjects())

    act(() => {
      result.current.deleteProject(sampleProject.id)
    })

    expect(result.current.projects).toEqual([])
    expect(localStorage.getItem('portfolio_cms_projects')).toBe('[]')
  })
})