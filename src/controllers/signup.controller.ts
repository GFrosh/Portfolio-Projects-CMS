import { apiError, apiResponse } from "@/lib/middleware";
import { get, query } from "@/lib/db";
import bcrypt from "bcryptjs";


interface SignupPayload {
	name: string;
	email: string;
	password: string;
}
interface GitHubSignupPayload {
	name?: string | null;
	email: string;
}


export async function signupController(payload: SignupPayload) {
	try {
		const { name, email, password } = payload;
		if (!name || !email || !password) {
			return apiError("Name, email, and password are required", 400);
		}

		const existingUser = await get("SELECT * FROM users WHERE email = $1", [email]);
		if (existingUser) {
			return apiError("User already exists", 409);
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await query(
			"INSERT INTO users (name, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
			[name, email, hashedPassword]
		);
		if (result.rowCount === 0) {
			return apiError("Failed to create user", 500);
		}
		
		return apiResponse("User created successfully", 201);
	} catch (error) {
		return apiError("Internal Server Error", 500);
	}
}

export async function GitHubSignupController(GitHubPayload: GitHubSignupPayload) {
	const { name, email } = GitHubPayload;
	if (!email) return apiError("Email is required", 400);

	try {
		const existingUser = await get<{ id: number }>("SELECT id FROM users WHERE email = $1", [email]);

		// Return early if they already exist
		if (existingUser) return apiResponse("User already exists", 200);

		const result = await query(
			"INSERT INTO users (name, email, created_at) VALUES ($1, $2, NOW()) RETURNING id",
			[name, email]
		);
		if (result.rowCount === 0) {
			return apiError("Failed to create user", 500);
		}

		return apiResponse("User created successfully via GitHub", 201);
	} catch (error) {
		return apiError("Internal Server Error", 500);
	}
}
