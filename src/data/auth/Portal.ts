import { AuthCredentials, AuthSignUpData } from "../../types/auth";
import type { ResponseObject } from "../../types/Response";

export default class Portal {
    private static readonly BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3000";

    private static async safeJson(res: Response): Promise<any> {
        const text = await res.text();
        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    }

    private static async post(path: string, payload: unknown): Promise<{ res: Response; body: any }> {
        const res = await fetch(`${Portal.BASE_URL}${path}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(payload)
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
            let { res, body } = await Portal.post("/signup", payload);

            // Some backends expose auth routes under /api/auth.
            if (res.status === 404) {
                ({ res, body } = await Portal.post("/api/auth/signup", payload));
            }

            // Some backends expose /register instead of /signup.
            if (res.status === 404) {
                ({ res, body } = await Portal.post("/register", payload));
            }

            if (res.status === 404) {
                ({ res, body } = await Portal.post("/api/auth/register", payload));
            }

            if (!res.ok) {
                return {
                    success: false,
                    message: body?.message ?? `Sign-up failed (${res.status})`,
                    error: body,
                };
            }

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

            if (body && typeof body.success === "boolean") {
                return body.success;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
}
