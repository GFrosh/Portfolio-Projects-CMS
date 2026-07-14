import { NextRequest } from "next/server";
import { apiError, apiResponse } from "@/lib/middleware";
import { get as g, all as a } from "@/lib/db";
import { auth } from "@/app/auth";
import type { Project } from "@/utils/types";


export const GET = async (request: NextRequest) => {
    try {
        const session = await auth();
        if (!session) {
            return apiError("Unauthorized", 401);
        }

        const userId = await g<{ id: number }>(`SELECT id FROM users WHERE email = $1`, [session?.user?.email]);
        if (!userId) {
            return apiError("User not found", 404);
        }

        const projects: Project[] = await a(`SELECT * FROM projects WHERE user_id = $1`, [userId?.id]);
        return apiResponse(projects, 200);
    } catch (error) {
        console.error("Error retrieving projects:", error);
        return apiError("Failed to retrieve projects", 500, error);
    }
};
