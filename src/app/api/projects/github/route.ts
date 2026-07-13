import { NextRequest } from 'next/server';
import { apiError, apiResponse } from '@/lib/middleware';
import env from '@/lib/env';


export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const repo = searchParams.get('repo');
	if (!repo) return apiError("Missing 'repo' parameter", 400);


	try {
		const response = await fetch(`https://api.github.com/repos/${repo}`, {
			headers: {
				'Accept': 'application/vnd.github+json',
				'User-Agent': 'My-NextJS-App',
				'Authorization': `Bearer ${env.githubAccessToken}`
			}
		});
		const data = await response.json();

		return apiResponse(data, 200);
	} catch (error) {
		console.error('Error fetching GitHub repository details:', error);
		return apiError('Internal Server Error', 500);
	}
}
