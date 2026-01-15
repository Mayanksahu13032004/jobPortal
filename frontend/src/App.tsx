import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmployerLogin from "./pages/employer/EmployerLogin";
import EmployerSignup from "./pages/employer/EmployerSignup";
import EmployerHome from "./pages/employer/EmployerHome";
import EmployerProfile from "./pages/employer/EmployerProfile";
import EmployerProfileForm from "./pages/employer/EmployerProfileForm";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerJobForm from "./pages/employer/EmployerJobForm";
import EmployerApplications from "./pages/employer/EmployerApplications";
import JobSeekerLogin from "./pages/jobseeker/JobSeekerLogin";
import JobSeekerSignup from "./pages/jobseeker/JobSeekerSignup";
import JobSeekerHome from "./pages/jobseeker/JobSeekerHome";
import JobSeekerJobs from "./pages/jobseeker/JobSeekerJobs";
import JobSeekerJobDetails from "./pages/jobseeker/JobSeekerJobDetails";
import JobSeekerProfile from "./pages/jobseeker/JobSeekerProfile";
import JobSeekerApplications from "./pages/jobseeker/JobSeekerApplications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Employer Routes */}
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/signup" element={<EmployerSignup />} />
          <Route path="/employer/home" element={<EmployerHome />} />
          <Route path="/employer/profile" element={<EmployerProfile />} />
          <Route
            path="/employer/profile/edit"
            element={<EmployerProfileForm />}
          />
          <Route path="/employer/jobs" element={<EmployerJobs />} />
          <Route path="/employer/jobs/new" element={<EmployerJobForm />} />
          <Route path="/employer/jobs/:id/edit" element={<EmployerJobForm />} />
          <Route
            path="/employer/jobs/:jobId/applications"
            element={<EmployerApplications />}
          />

          {/* Job Seeker Routes */}
          <Route path="/jobseeker/login" element={<JobSeekerLogin />} />
          <Route path="/jobseeker/signup" element={<JobSeekerSignup />} />
          <Route path="/jobseeker/home" element={<JobSeekerHome />} />
          <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
          <Route path="/jobseeker/jobs" element={<JobSeekerJobs />} />
          <Route
            path="/jobseeker/jobs/:jobId"
            element={<JobSeekerJobDetails />}
          />
          <Route
            path="/jobseeker/applications"
            element={<JobSeekerApplications />}
          />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
