import { apiResponse } from '@/lib/middleware';

export const GET = async (_request: Request) => {
	return apiResponse("Testing API route...", 200);
}
