import { beforeEach, describe, expect, it } from 'vitest'
import { LocalAuthRepository } from './repository'

describe('LocalAuthRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('authenticates valid user credentials and stores session', async () => {
    const repo = new LocalAuthRepository()

    const result = await repo.signIn({
      email: 'user@portfolio.local',
      password: 'user123',
    })

    expect(result).not.toBeNull()
    expect(result?.user.email).toBe('user@portfolio.local')
    expect(localStorage.getItem('portfolio_cms_auth_session')).not.toBeNull()
  })

  it('returns null for invalid credentials', async () => {
    const repo = new LocalAuthRepository()

    const result = await repo.signIn({
      email: 'user@portfolio.local',
      password: 'wrong-password',
    })

    expect(result).toBeNull()
  })

  it('loads current user from active session and clears on signOut', async () => {
    const repo = new LocalAuthRepository()

    await repo.signIn({
      email: 'user@portfolio.local',
      password: 'user123',
    })

    const currentUser = await repo.getCurrentUser()
    expect(currentUser?.email).toBe('user@portfolio.local')

    await repo.signOut()

    const afterSignOut = await repo.getCurrentUser()
    expect(afterSignOut).toBeNull()
  })

  it('creates a new account and signs the user in', async () => {
    const repo = new LocalAuthRepository()

    const result = await repo.signUp({
      name: 'New User',
      email: 'new@portfolio.local',
      password: 'new123',
    })

    expect(result).not.toBeNull()
    expect(result?.user.name).toBe('New User')
    expect(result?.user.email).toBe('new@portfolio.local')
    expect(localStorage.getItem('portfolio_cms_auth_session')).not.toBeNull()
  })

  it('rejects sign-up when email already exists', async () => {
    const repo = new LocalAuthRepository()

    const result = await repo.signUp({
      name: 'Duplicate User',
      email: 'user@portfolio.local',
      password: 'another123',
    })

    expect(result).toBeNull()
  })
})
