import { NextRequest } from "next/server";
import { apiError } from "@/lib/middleware";
import { loginController } from "@/controllers/login.controller";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;
        return await loginController({ email, password });    
    } catch (error) {
        console.error('Error during login:', error);
        return apiError("Internal Server Error", 500);
    }
}
