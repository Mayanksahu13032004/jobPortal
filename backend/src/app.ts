import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Job Portal Auth API (TypeScript) is running' });
});

export default app;
