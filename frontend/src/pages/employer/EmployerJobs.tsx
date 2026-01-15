import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  LogOut,
  Plus,
  Briefcase,
  ArrowLeft,
  Menu,
  User,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useJobs } from "@/hooks/useJobs";
import { Job } from "@/types/job";
import JobCard from "@/components/employer/JobCard";
import DeleteJobDialog from "@/components/employer/DeleteJobDialog";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const EmployerJobs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { jobs, isLoading, deleteJob } = useJobs(user?.id);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/employer/login");
      return;
    }

    const userData: UserData = JSON.parse(storedUser);
    if (userData.role !== "employer") {
      navigate("/jobseeker/home");
      toast({
        title: "Access Denied",
        description: "This page is only accessible to Employers.",
        variant: "destructive",
      });
      return;
    }

    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleEdit = (job: Job) => {
    navigate(`/employer/jobs/${job.id}/edit`);
  };

  const handleViewApplications = (job: Job) => {
    navigate(`/employer/jobs/${job.id}/applications`);
  };

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    const success = await deleteJob(jobToDelete.id);

    if (success) {
      toast({
        title: "Job Deleted",
        description: "The job listing has been deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete job listing.",
        variant: "destructive",
      });
    }

    setIsDeleting(false);
    setJobToDelete(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-employer">
              <Building2 className="w-5 h-5 text-employer-foreground" />
            </div>
            <span className="text-lg font-bold">JobConnect</span>
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/employer/profile")}
            >
              <User className="w-4 h-4 mr-2" /> Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* MOBILE */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/employer/profile")}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/employer/home")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Job Listings</h1>
            <p className="text-muted-foreground">Manage your job postings</p>
          </div>
          <Button
            variant="employer"
            onClick={() => navigate("/employer/jobs/new")}
          >
            <Plus className="w-4 h-4 mr-2" /> Post New Job
          </Button>
        </div>

        {/* JOB LIST */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-employer rounded-full" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">No Jobs Posted</h2>
            <p className="text-muted-foreground mb-6">
              Start by posting your first job
            </p>
            <Button
              variant="employer"
              onClick={() => navigate("/employer/jobs/new")}
            >
              <Plus className="w-4 h-4 mr-2" /> Post Job
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onViewApplications={() => handleViewApplications(job)}
              />
            ))}
          </div>
        )}
      </main>

      {/* DELETE DIALOG */}
      <DeleteJobDialog
        job={jobToDelete}
        isOpen={!!jobToDelete}
        isDeleting={isDeleting}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default EmployerJobs;
