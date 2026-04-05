import express from 'express';
import { getProjects } from '../controllers/projectController';

const router = express.Router();

// This will be accessible at /api/projects
router.get('/', getProjects);

export default router;