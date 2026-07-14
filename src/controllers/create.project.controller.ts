import { apiError, apiResponse } from "@/lib/middleware";
import { auth } from "@/app/auth";
import { query as q, get as g } from "@/lib/db";
import type { ProjectFormData } from "@/utils/types";

export async function createProject(payload: ProjectFormData) {
    const session = await auth();
    const userId = await g<{ id: number }>(`SELECT id FROM users WHERE email = $1`, [session?.user?.email]);
    if (!userId) {
        return apiError("User not found", 404);
    }
    
    const formattedTags = `{${payload.tags.map(t => `"${t}"`).join(',')}}`;
    try {
        const result = await q("INSERT INTO projects (title, user_id, short_description, description, tags, github_url, demo_url, image_url, status, featured, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id", [
            payload.title,
            userId?.id,
            payload.description,
            payload.longDescription,
            formattedTags,
            payload.githubUrl,
            payload.demoUrl,
            payload.imageUrl,
            payload.status,
            payload.featured
        ]);
        if (!result) {
            throw new Error("Failed to create project");
        }
    
        return apiResponse("Project created successfully", 201);
    } catch (error) {
	    console.error("Error creating project:", error);
        return apiError("Failed to create project", 500, error);
    }
}
