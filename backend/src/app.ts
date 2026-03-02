import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import jobseekerProfileRoutes from './routes/jobseekerProfile.routes';
import employerProfileRoutes from './routes/employerProfile.routes';
import jobRoutes from './routes/job.routes';
import jobApplicationRoutes from './routes/jobApplication.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app: Application = express();

// CORS setup to allow both local dev and deployed frontend
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'https://jobportal-frontend-yy0n.onrender.com',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Serve uploads folder
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobseeker/profile', jobseekerProfileRoutes);
app.use('/api/employer/profile', employerProfileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/applicants', jobseekerProfileRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Job Portal Auth API (TypeScript) is running' });
});

export default app;
