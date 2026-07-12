import { NextRequest } from "next/server";
import { apiError } from "@/lib/middleware";
import { signupController } from "@/controllers/signup.controller";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body;
        return await signupController({ name, email, password });    
    } catch (error) {
        console.error('Error during sign-up:', error);
        return apiError("Internal Server Error", 500);
    }
}
