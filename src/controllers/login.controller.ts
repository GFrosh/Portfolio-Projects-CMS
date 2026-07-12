import { apiError, apiResponse } from "@/lib/middleware";
import { get } from "@/lib/db";
import bcrypt from "bcryptjs";
import { CredentialsSignin } from "next-auth";


interface LoginPayload {
    email: string;
    password: string;
}
interface AuthCredentials {
	email?: string;
	password?: string;
}
class GitHubAccountException extends CredentialsSignin {
	code = "This account uses GitHub Sign-In. Please click 'Continue with GitHub'.";
}
class InvalidCredentialsException extends CredentialsSignin {
	code = "Invalid email or password";
}


export async function loginController(payload: LoginPayload) {
    try {
        const { email, password } = payload;
        if (!email || !password) {
            return apiError("Email and password are required", 400);
        }

        const existingUser = await get<{ email: string; password_hash: string }>("SELECT email, password_hash FROM users WHERE email = $1", [email]);
        if (!existingUser) {
            // False 404 type shii
            return apiError("Invalid email or password", 401);
        }


        if (email === existingUser.email && !existingUser.password_hash) {
            return apiError("This account uses GitHub Sign-In. Please click 'Continue with GitHub'.", 400);
        }


        const isMatch = await bcrypt.compare(password, existingUser.password_hash);
        if (!isMatch) {
            return apiError("Invalid email or password", 401);
        }

        return apiResponse("Login successful", 200);
    } catch (error) {
        return apiError("Internal Server Error", 500);
    }
}


export async function authAuthorizeController(credentials: AuthCredentials) {
	if (!credentials?.email || !credentials?.password) {
		throw new InvalidCredentialsException();
	}

	const email = credentials.email as string;
	const password = credentials.password as string;

	try {
		const existingUser = await get<{ id: number; name: string; email: string; password_hash: string }>(
			"SELECT id, name, email, password_hash FROM users WHERE email = $1", 
			[email]
		);

		if (!existingUser) {
			throw new InvalidCredentialsException();
		}

		if (email === existingUser.email && !existingUser.password_hash) {
			throw new GitHubAccountException();
		}

		const isMatch = await bcrypt.compare(password, existingUser.password_hash);
		if (!isMatch) {
			throw new InvalidCredentialsException();
		}

		return {
			id: existingUser.id.toString(),
			name: existingUser.name,
			email: existingUser.email,
		};
	} catch (error) {
		if (error instanceof Error) throw error;
		
		throw new Error("Internal Server Error");
	}
}
