'use client';

import type {
  AuthCredentials,
  AuthSignUpData,
  AuthUser,
  ResponseObject,
} from '@/types/auth';

/**
 * Portal: backend-first auth client.
 * Uses fetch against a REST API — the base URL is configured via
 * NEXT_PUBLIC_API_BASE_URL.
 */
export default class Portal {
  public static readonly BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
  public static readonly USER_KEY =
    process.env.NEXT_PUBLIC_USER_KEY ?? 'portdeck_auth_user';
  private static readonly TOKEN_KEY = 'portdeck_auth_token';

  static async safeJson(res: Response): Promise<Record<string, unknown> | null> {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private static getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  private static async post(path: string, payload: unknown) {
    const res = await fetch(`${Portal.BASE_URL}${path}`, {
      headers: this.getAuthHeaders(),
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const body = await Portal.safeJson(res);
    return { res, body };
  }

  private static async get(path: string) {
    const res = await fetch(`${Portal.BASE_URL}${path}`, {
      headers: this.getAuthHeaders(),
      method: 'GET',
    });
    const body = await Portal.safeJson(res);
    return { res, body };
  }

  static async signIn(payload: AuthCredentials): Promise<ResponseObject> {
    try {
      const { res, body } = await this.post('/api/auth/login', payload);
      if (!res.ok) {
        return {
          success: false,
          message:
            (body?.message as string) ?? `Sign-in failed (${res.status})`,
          error: body,
        };
      }
      const user = (body?.user as AuthUser | null) ?? null;
      this.saveUser(user);
      return {
        success: (body?.success as boolean) ?? true,
        message: (body?.message as string) ?? 'Sign-in successful.',
        user,
        data: body,
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during sign-in.',
        error,
      };
    }
  }

  static async signup(payload: AuthSignUpData): Promise<ResponseObject> {
    try {
      const { res, body } = await Portal.post('/api/auth/signup', payload);
      if (!res.ok) {
        return {
          success: false,
          message:
            (body?.message as string) ?? `Sign-up failed (${res.status})`,
          error: body,
        };
      }
      const user = (body?.user as AuthUser | null) ?? null;
      this.saveUser(user);
      return {
        success: (body?.success as boolean) ?? true,
        message: (body?.message as string) ?? 'Sign-up successful.',
        user,
        data: body,
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during sign-up.',
        error,
      };
    }
  }

  static async logout(): Promise<boolean> {
    try {
      const res = await fetch(`${Portal.BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const body = await this.safeJson(res);
      if (!res.ok) return false;
      this.clearUser();
      this.clearAuthToken();
      if (body && typeof body.success === 'boolean') return body.success;
      return true;
    } catch {
      // Still clear local state even if server call fails
      this.clearUser();
      this.clearAuthToken();
      return true;
    }
  }

  static getUser(): AuthUser | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  static saveUser(user: AuthUser | null): void {
    if (!this.isBrowser() || !user) return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static clearUser(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.USER_KEY);
  }

  static setAuthToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getAuthToken(): string | null {
    if (!this.isBrowser()) return null;
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static clearAuthToken(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static async processOAuthCallback(token: string): Promise<ResponseObject> {
    try {
      this.setAuthToken(token);
      const { res, body } = await this.get('/api/auth/user');
      if (!res.ok) {
        return {
          success: false,
          message:
            (body?.message as string) ??
            `Failed to fetch user profile (${res.status})`,
          error: body,
        };
      }
      const user =
        ((body?.user as AuthUser | undefined) ??
          (body as unknown as AuthUser)) ||
        null;
      this.saveUser(user);
      return {
        success: true,
        message: 'Authentication successful.',
        user,
        data: body,
      };
    } catch (error) {
      this.clearAuthToken();
      return {
        success: false,
        message: 'An error occurred during OAuth callback.',
        error,
      };
    }
  }

  static getGitHubLoginUrl(): string {
    return `${this.BASE_URL}/api/auth/github`;
  }
}
