import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import jobseekerProfileRoutes from './routes/jobseekerProfile.routes';
import employerProfileRoutes from './routes/employerProfile.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobseeker/profile', jobseekerProfileRoutes);
app.use('/api/employer/profile', employerProfileRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Job Portal Auth API (TypeScript) is running' });
});

export default app;
