import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import jobseekerProfileRoutes from './routes/jobseekerProfile.routes';
import employerProfileRoutes from './routes/employerProfile.routes';
import jobRoutes from './routes/job.routes';
import jobApplicationRoutes from './routes/jobApplication.routes';
import dashboardRoutes from './routes/dashboard.routes';
import jobseekerProfileRouter from './routes/jobseekerProfile.routes';
const app: Application = express();

// CORS setup for credentials
app.use(cors({
  origin: 'http://localhost:8080' 
}));



// Serve uploads folder
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobseeker/profile', jobseekerProfileRoutes);
app.use('/api/employer/profile', employerProfileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/applicants', jobseekerProfileRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Job Portal Auth API (TypeScript) is running' });
});

export default app;
