import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes'
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

// Basic Route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Portfolio CMS API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});