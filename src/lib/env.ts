/**
 * Environment variable validation and type-safe access
 * Fails fast if required environment variables are missing
 */
export function ensureVariables() {
	const required = ['DATABASE_URL','JWT_SECRET','GITHUB_ACCESS_TOKEN'];
	for (const key of required) {
		if (!process.env[key]) {
			console.error(`\x1b[31m🚨 NEXTJS BUILD ERROR: Missing environment variable [${key}]\x1b[0m`);
			process.exit(1);
		}
		console.log(`✅ ${key} is set`);
	}
}


const env = {
	PORT: parseInt(process.env.PORT || '3000', 10),
	NODE_ENV: process.env.NODE_ENV || 'development',
	JWT_SECRET: process.env.JWT_SECRET!,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	db_url: process.env.DATABASE_URL,
	email_user: process.env.EMAIL_USER,
	email_pass: process.env.EMAIL_PASS,
	baseUrl: String(process.env.BASE_URL),
	githubAccessToken: process.env.GITHUB_ACCESS_TOKEN
};

export default env;
