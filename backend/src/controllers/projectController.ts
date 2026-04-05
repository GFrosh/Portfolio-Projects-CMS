import { type Request, type Response } from 'express';
import pool from '../config/db'; 

export const getProjects = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    
    // mapped the database names (snake_case) to your frontend names (camelCase)
    const projects = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      githubUrl: row.github_link,
      demoUrl: row.live_link,
      tags: row.tech_stack,
      createdAt: row.created_at,
    }));

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};