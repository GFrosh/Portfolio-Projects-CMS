import { NextRequest } from 'next/server';
import { apiError, apiResponse } from '@/lib/middleware';
import env from "@/lib/env";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // Validate that the username was provided
    if (!username) {
        return apiError('Username parameter is required', 400);
    }

    try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
            headers: {
            	'Accept': 'application/vnd.github+json',
            	'User-Agent': 'My-NextJS-App',
            	'Authorization': `Bearer ${env.githubAccessToken}`
            }
        });
        const data = await response.json();
        return apiResponse(data, 200);
    } catch (error) {
		console.error('Error fetching GitHub repositories:', error);
        return apiError('Internal Server Error', 500);
    }
}
