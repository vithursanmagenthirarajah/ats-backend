import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import questionsRoutes from './routes/questions.routes';
import applicationsRoutes from './routes/applications.routes';
import publicRoutes from './routes/public.routes';
import { errorHandler } from './middleware/errorHandler';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobsRoutes);
  app.use('/api/jobs', questionsRoutes); // /api/:jobId/questions
  app.use('/api/applications', applicationsRoutes);
  app.use('/api/public', publicRoutes);

  app.use(errorHandler);

  return app;
}
