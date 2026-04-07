import type { AuthUser } from '../../types/auth';

const USER_KEY = ((import.meta as any).env?.USER_KEY as string | undefined) ?? 'portfolio_cms_auth_user';

export const authRepository = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const rawUser = localStorage.getItem(USER_KEY);
      if (!rawUser) {
        return null;
      }

      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  }
};
