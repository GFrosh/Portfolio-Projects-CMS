import env from '@/lib/env';


export async function signIn({ email, password }: { email: string; password: string }) {
	"use server";
	const res = await fetch(`${env.baseUrl}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});
	if (!res.ok) {
		throw new Error('Failed to sign in');
	}
	return true;
}

export async function signUp({ name, email, password }: { name: string; email: string; password: string }) {
	"use server";
	const res = await fetch(`${env.baseUrl}/api/auth/signup`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, email, password }),
	});
	if (!res.ok) {
		throw new Error('Failed to sign up');
	}
	return true;
}

export async function signOut() {
	"use server";
	const res = await fetch(`${env.baseUrl}/api/auth/logout`, {
		method: 'POST',
	});
	if (!res.ok) {
		throw new Error('Failed to sign out');
	}
	return true;
}	
