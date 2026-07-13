// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const sessionToken =
	request.cookies.get("__Secure-next-auth.session-token")?.value ||
	request.cookies.get("next-auth.session-token")?.value;

	const { pathname } = request.nextUrl;

	const isDashboardRoute = pathname.startsWith("/dashboard");
	const isAuthRoute = pathname === "/login" || pathname === "/signup";

	if (isDashboardRoute && !sessionToken) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("callbackUrl", pathname); 
		return NextResponse.redirect(loginUrl);
	}

	if (isAuthRoute && sessionToken) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

// 3. Optimization Matcher: Only run on pages/APIs, skip static assets and images
export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$).*)",
	]
};
