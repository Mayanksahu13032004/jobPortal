"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const jobseekerProfile_routes_1 = __importDefault(require("./routes/jobseekerProfile.routes"));
const employerProfile_routes_1 = __importDefault(require("./routes/employerProfile.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const jobApplication_routes_1 = __importDefault(require("./routes/jobApplication.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const app = (0, express_1.default)();
// CORS setup for credentials
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080'
}));
// Serve uploads folder
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/jobseeker/profile', jobseekerProfile_routes_1.default);
app.use('/api/employer/profile', employerProfile_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/api/applications', jobApplication_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/applicants', jobseekerProfile_routes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Job Portal Auth API (TypeScript) is running' });
});
exports.default = app;
