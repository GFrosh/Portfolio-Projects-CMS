import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type token } from '@/lib/auth';


// TYPES DEFINITIONS
export type RouteParams =
	| Record<string, string>
	| Promise<Record<string, string>>;
export type RouteContext = { params?: RouteParams };
export type RouteHandler = (req: NextRequest, context?: RouteContext) => Response | Promise<Response>;




/**
 * 
 A simple function to resolve undissolved params
 */
export async function resolveParams(context?: RouteContext) {
	const params = context?.params;
	if (params && typeof (params as Promise<Record<string, string>>).then === "function") {
		return await params;
	}
	return params;
}



/**
 * Extract and verify JWT token from request
 */
export function extractToken(req: NextRequest): token | null {
	const authHeader = req.headers.get('authorization');
	if (authHeader?.startsWith('Bearer ')) {
		return authHeader.slice(7);
	}
	return req.cookies.get('token')?.value || null;
}


/**
 * Middleware to verify JWT token
 */
export function withAuth(handler: RouteHandler) {
	return async (req: NextRequest, context?: RouteContext) => {
		try {
			const token = extractToken(req);
			if (!token) {
				return NextResponse.json(
				{ error: 'Unauthorized: No token' },
				{ status: 401 }
				);
			}

			verifyToken(token);
			
			const params = await resolveParams(context);

			return handler(req, params ? { params } : context);
		} catch {
			return NextResponse.json(
				{ error: 'Unauthorized: Invalid token' },
				{ status: 401 }
			);
		}
	};
}



/**
 * Type-safe API response helper
 */
export function apiResponse<T>(data: T, status: number = 200, success: boolean = true, headers?: Record<string, string>) {
	const response = NextResponse.json({ success, data }, { status });
	
	if (headers) {
		Object.entries(headers).forEach(([key, value]) => {
			response.headers.set(key, value);
		});
	}
	return response;
}

/**
 * API error response helper
 */
export function apiError(message: string, status: number = 400, details?: unknown) {
	return NextResponse.json({
		success: false,
		error: message,
		...(details !== undefined ? { details } : {}),
	},
	{ status }
	);
}
