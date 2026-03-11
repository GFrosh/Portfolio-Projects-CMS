import { beforeEach, describe, expect, it } from 'vitest'
import { loadProjects, saveProjects } from './storage'
import { sampleProject } from '../test/fixtures'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when storage is empty', () => {
    expect(loadProjects()).toEqual([])
  })

  it('persists and reloads projects', () => {
    saveProjects([sampleProject])

    expect(loadProjects()).toEqual([sampleProject])
  })

  it('returns an empty list when stored JSON is invalid', () => {
    localStorage.setItem('portfolio_cms_projects', '{invalid json')

    expect(loadProjects()).toEqual([])
  })
})