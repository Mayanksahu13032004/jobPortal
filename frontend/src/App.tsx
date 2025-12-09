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
import JobSeekerLogin from "./pages/jobseeker/JobSeekerLogin";
import JobSeekerSignup from "./pages/jobseeker/JobSeekerSignup";
import JobSeekerHome from "./pages/jobseeker/JobSeekerHome";

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
          {/* Job Seeker Routes */}
          <Route path="/jobseeker/login" element={<JobSeekerLogin />} />
          <Route path="/jobseeker/signup" element={<JobSeekerSignup />} />
          <Route path="/jobseeker/home" element={<JobSeekerHome />} />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;