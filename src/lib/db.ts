import { Pool, type PoolConfig } from 'pg';
import envs from './env';
import logger from './logger';



// ===============================
// POSTGRESQL POOL SETUP
// ===============================
let pool: Pool | null = null;
const isProduction = envs.NODE_ENV === 'production';


if (envs.db_url) {
	const poolConfig: PoolConfig = {
		connectionString: envs.db_url,
		ssl: isProduction ? { rejectUnauthorized: false } : false
	};
	
	pool = new Pool(poolConfig);
} else if (isProduction) {
  	throw new Error('DATABASE_URL is required in production');
} else {
  logger.warn('DATABASE_URL is missing in development. DB features are disabled until it is configured.');
}

function getPoolOrThrow(): Pool {
	if (!pool) {
		throw new Error('Database is not configured. Set DATABASE_URL to enable DB features.');
	}
	return pool;
}



/**
 * DATABASE HELPER OBJECT
 * Provides promisified query methods and transaction support
 */
const db = {
	/**
	 * Execute a query and return the result rows.
	 * @param text SQL query string
	 * @param params Optional array of parameters for parameterized queries
	 */
	query: (text: string, params?: unknown[]) => getPoolOrThrow().query(text, params),


	/**
	 * Retrieve a single row from a query. Returns undefined if no rows are found.
	 */
	get: async <T>(text: string, params?: unknown[]) => {
		const { rows } = await getPoolOrThrow().query(text, params);
				return rows[0] as T | undefined;
	},

	/**
	Retrieve all columns from a query as an array of objects. Returns an empty array if no rows are found.
	*/
	all: async <T = unknown>(text: string, params?: unknown[]) => {
	const { rows } = await getPoolOrThrow().query(text, params);
			return rows as T[];
	},


	/**
	 * Execute a query and return the number of affected rows.
	 */
	affectedRows: (text: string, params?: unknown[]) => getPoolOrThrow().query(text, params).then((result) => result.rowCount),
	
	
	pool
};



/**
 * Execute a series of queries within a transaction. If any query fails, the transaction is rolled back.
 * @param fn A function that receives a database client and performs queries. Should return a Promise.
 */
async function transaction<T = unknown>(fn: (client: any) => Promise<T>): Promise<T> {
  	const client = await getPoolOrThrow().connect();
	try {
		await client.query('BEGIN');
		const result = await fn(client);
		await client.query('COMMIT');
		return result;
	} catch (err) {
		await client.query('ROLLBACK');
		throw err;
	} finally {
		client.release();
	}
}



// ===============================
// ENSURE TABLES EXIST
// ===============================
async function ensureTables() {
	await getPoolOrThrow().query(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS projects (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			github_url VARCHAR(255),
			demo_url VARCHAR(255),
			image_url VARCHAR(255),
			tags TEXT[],
			status VARCHAR(20) DEFAULT 'draft',
			featured BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`);
	logger.info('✓ Tables ensured!');
}



/**
 * Initialise the database connection and ensure required tables exist. If DATABASE_URL is not set in production, the process will exit with an error.
 * @returns | Promise<void> | error
 */
export async function initialiseDatabase() {
	if (!envs.db_url) {
		if (!isProduction) {
			return logger.warn('Skipping database initialization in development because DATABASE_URL is not set.');
		}
		logger.error('Database startup error', { error: 'DATABASE_URL is required in production' });
		process.exit(1);
	}

	try {
		await ensureTables();
		logger.info('Database initialised successfully');
	} catch (err: any) {
		logger.error('Database startup error', err.message || err);
		if (isProduction) {
			process.exit(1);
		}
	}
}

// ===============================
// EXPORT DB OBJECT
// ===============================
export default db;
export const query = db.query;
export const get = db.get;
export const all = db.all;
export { transaction };
