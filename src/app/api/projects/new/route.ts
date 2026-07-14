import { NextRequest, NextResponse } from 'next/server';
import { apiError, apiResponse } from "@/lib/middleware";
import { createProject } from '@/controllers/create.project.controller';

export async function POST(request: NextRequest) {
	try {
        const data = await request.json();
	    return await createProject(data);
    } catch (error) {
        return apiError("Failed to create project", 500, error);
    }
}
