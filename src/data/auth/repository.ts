import type { AuthRepository, AuthSignUpData, AuthUser, SignInResult } from '../../types/auth';

interface LocalAuthUserRecord extends AuthUser {
  	password: string;
}

const USERS_KEY = 'portfolio_cms_auth_users';
const SESSION_KEY = 'portfolio_cms_auth_session';

const SEED_USERS: LocalAuthUserRecord[] = [
	{
		id: 'user-1',
		name: 'Portfolio User',
		email: 'user@portfolio.local',
		password: 'user123',
		createdAt: '2026-01-01T00:00:00.000Z',
		lastLoginAt: null,
	}
];

function toPublicUser(record: LocalAuthUserRecord): AuthUser {
  const { password: _password, ...publicUser } = record;
  return publicUser;
}

function loadUsers(): LocalAuthUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return [...SEED_USERS];
    }

    const parsed = JSON.parse(raw) as LocalAuthUserRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return [...SEED_USERS];
    }

    return parsed;
  } catch {
    return [...SEED_USERS];
  }
}

function saveUsers(users: LocalAuthUserRecord[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createSession(userId: string) {
  return {
    token: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    userId,
    issuedAt: new Date().toISOString(),
  };
}

export class LocalAuthRepository implements AuthRepository {
  async signIn(emailAndPassword: { email: string; password: string }): Promise<SignInResult | null> {
    const email = emailAndPassword.email.trim().toLowerCase();
    const users = loadUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === email && u.password === emailAndPassword.password);

    if (index === -1) return null;

    const updatedUser: LocalAuthUserRecord = {
      ...users[index],
      lastLoginAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    saveUsers(users);

    const session = createSession(updatedUser.id);

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return {
      session,
      user: toPublicUser(updatedUser),
    };
  }

  async signUp(data: AuthSignUpData): Promise<SignInResult | null> {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (!name || !email || !password) {
      return null;
    }

    const users = loadUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email);
    if (exists) {
      return null;
    }

    const now = new Date().toISOString();
    const newUser: LocalAuthUserRecord = {
      id: globalThis.crypto?.randomUUID?.() ?? `user-${Date.now()}`,
      name,
      email,
      password,
      createdAt: now,
      lastLoginAt: now,
    };

    users.push(newUser);
    saveUsers(users);

    const session = createSession(newUser.id);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return {
      session,
      user: toPublicUser(newUser),
    };
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (!rawSession) {
        return null;
      }

      const session = JSON.parse(rawSession) as { userId: string };
      const users = loadUsers();
      const user = users.find((u) => u.id === session.userId);

      return user ? toPublicUser(user) : null;
    } catch {
      return null;
    }
  }
}

export const authRepository: AuthRepository = new LocalAuthRepository();
