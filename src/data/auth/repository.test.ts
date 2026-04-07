import { beforeEach, describe, expect, it } from 'vitest'
import { authRepository } from './repository'

describe('authRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no stored user exists', async () => {
    const currentUser = await authRepository.getCurrentUser()
    expect(currentUser).toBeNull()
  })

  it('returns stored user when present in localStorage', async () => {
    localStorage.setItem(
      'portfolio_cms_auth_user',
      JSON.stringify({
        id: 'u-1',
        name: 'User One',
        email: 'user@portfolio.local',
        createdAt: '2026-01-01T00:00:00.000Z',
        lastLoginAt: null,
      })
    )

    const currentUser = await authRepository.getCurrentUser()
    expect(currentUser?.email).toBe('user@portfolio.local')
  })
})
