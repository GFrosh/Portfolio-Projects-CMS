import { AuthCredentials, AuthSignUpData, AuthUser } from "../../types/auth";
import type { ResponseObject } from "../../types/Response";

export default class Portal {
    public static readonly BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3000";
    public static readonly USER_KEY = ((import.meta as any).env?.VITE_USER_KEY as string | undefined) ?? 'portfolio_cms_auth_user';
    private static readonly TOKEN_KEY = 'auth_token';

    public static async safeJson(res: Response): Promise<any> {
        const text = await res.text();
        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch {
            return {
                message: text
            };
        }
    }

    private static getAuthHeaders(): HeadersInit {
        const token = this.getAuthToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json"
        };
        if (token) {
            (headers as any)["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    }

    private static async post(path: string, payload: unknown): Promise<{ res: Response; body: any }> {
        const res = await fetch(`${Portal.BASE_URL}${path}`, {
            headers: this.getAuthHeaders(),
            method: "POST",
            body: JSON.stringify(payload)
        });

        const body = await Portal.safeJson(res);
        return { res, body };
    }

    private static async get(path: string): Promise<{ res: Response; body: any }> {
        const res = await fetch(`${Portal.BASE_URL}${path}`, {
            headers: this.getAuthHeaders(),
            method: "GET"
        });

        const body = await Portal.safeJson(res);
        return { res, body };
    }

    static async signIn(payload: AuthCredentials): Promise<ResponseObject> {
        try {
            let { res, body } = await this.post("/api/auth/login", payload);

            if (!res.ok) {
                return {
                    success: false,
                    message: body?.message ?? `Sign-in failed (${res.status})`,
                    error: body,
                };
            }


            this.saveUser(body?.user ?? null);

            return {
                success: body?.success ?? true,
                message: body?.message ?? "Sign-in successful.",
                user: body?.user,
                data: body,
            };
        } catch (error) {
            return {
                success: false,
                message: "An error occurred during sign-in.",
                error
            };
        }
    }

    static async signup(payload: AuthSignUpData): Promise<ResponseObject> {
        try {
            let { res, body } = await Portal.post("/api/auth/signup", payload);

            if (!res.ok) {
                return {
                    success: false,
                    message: body?.message ?? `Sign-up failed (${res.status})`,
                    error: body,
                };
            }
            this.saveUser(body?.user ?? null);

            return {
                success: body?.success ?? true,
                message: body?.message ?? "Sign-up successful.",
                user: body?.user,
                data: body,
            };
        } catch (error) {
            return {
                success: false,
                message: "An error occurred during sign-up.",
                error
            };
        }
    }

    static async logout(): Promise<boolean> {
        try {
            let res = await fetch(`${Portal.BASE_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });

            const body = await this.safeJson(res);
            if (!res.ok) return false;

            this.clearUser();

            if (body && typeof body.success === "boolean") {
                return body.success;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    static getUser(): AuthUser | null {
        try {
            const rawUser = localStorage.getItem(this.USER_KEY);
            return rawUser ? JSON.parse(rawUser) : null;
        } catch {
            return null;
        }

    }

    static saveUser(user: AuthUser | null): void {
        if (user) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
    }

    static clearUser(): void {
        localStorage.removeItem(this.USER_KEY);
    }

    // OAuth Token Management
    static setAuthToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getAuthToken(): string | null {
        try {
            return localStorage.getItem(this.TOKEN_KEY);
        } catch {
            return null;
        }
    }

    static clearAuthToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    // GitHub OAuth Callback Handler
    static async processOAuthCallback(token: string): Promise<ResponseObject> {
        try {
            this.setAuthToken(token);

            // Fetch current user with the token
            const { res, body } = await this.get("/api/auth/user");

            if (!res.ok) {
                return {
                    success: false,
                    message: body?.message ?? `Failed to fetch user profile (${res.status})`,
                    error: body,
                };
            }

            const user = body?.user ?? body;
            this.saveUser(user);

            return {
                success: true,
                message: "Authentication successful.",
                user,
                data: body,
            };
        } catch (error) {
            this.clearAuthToken();
            return {
                success: false,
                message: "An error occurred during OAuth callback.",
                error
            };
        }
    }

    // GitHub OAuth Start
    static getGitHubLoginUrl(): string {
        return `${this.BASE_URL}/api/auth/github`;
    }
}
