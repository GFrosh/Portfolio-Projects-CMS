import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;



const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', 
  password: 'jesse78', 
  port: 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;