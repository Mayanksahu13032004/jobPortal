"use strict";
// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import authRoutes from './routes/auth.routes';
// import jobseekerProfileRoutes from './routes/jobseekerProfile.routes';
// import employerProfileRoutes from './routes/employerProfile.routes';
// import jobRoutes from './routes/job.routes';
// import jobApplicationRoutes from './routes/jobApplication.routes';
// import dashboardRoutes from './routes/dashboard.routes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app: Application = express();
// app.use(cors());
// app.use(express.json());
// app.use('/api/auth', authRoutes);
// app.use('/api/jobseeker/profile', jobseekerProfileRoutes);
// app.use('/api/employer/profile', employerProfileRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/applications', jobApplicationRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.get('/', (req: Request, res: Response) => {
//   res.json({ message: 'Job Portal Auth API (TypeScript) is running' });
// });
// export default app;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const jobseekerProfile_routes_1 = __importDefault(require("./routes/jobseekerProfile.routes"));
const employerProfile_routes_1 = __importDefault(require("./routes/employerProfile.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const jobApplication_routes_1 = __importDefault(require("./routes/jobApplication.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const jobseekerProfile_routes_2 = __importDefault(require("./routes/jobseekerProfile.routes"));
const app = (0, express_1.default)();
// ✅ CORS setup for credentials
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080' // allow cookies / auth headers
}));
// Serve uploads folder
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/jobseeker/profile', jobseekerProfile_routes_1.default);
app.use('/api/employer/profile', employerProfile_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/applications', jobApplication_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/applicants', jobseekerProfile_routes_2.default);
app.get('/', (req, res) => {
    res.json({ message: 'Job Portal Auth API (TypeScript) is running' });
});
exports.default = app;
