import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useJobs } from "@/hooks/useJobs";
import { Job, JobFormData } from "@/types/job";
import JobForm from "@/components/employer/JobForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const EmployerJobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(!!id);

  const { getJob, createJob, updateJob } = useJobs(user?.id);

  const isEditMode = !!id;

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/employer/login");
      return;
    }

    const userData: User = JSON.parse(storedUser);

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

  useEffect(() => {
    const loadJob = async () => {
      if (!id || !user) return;

      setIsLoadingJob(true);
      const jobData = await getJob(id);

      if (!jobData) {
        toast({
          title: "Job Not Found",
          description: "The requested job listing could not be found.",
          variant: "destructive",
        });
        navigate("/employer/jobs");
        return;
      }

      if (jobData.employerId !== user.id) {
        toast({
          title: "Access Denied",
          description: "You can only edit your own job listings.",
          variant: "destructive",
        });
        navigate("/employer/jobs");
        return;
      }

      setJob(jobData);
      setIsLoadingJob(false);
    };

    loadJob();
  }, [id, user, getJob, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleSubmit = async (formData: JobFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditMode && job) {
        const updatedJob = await updateJob(job.id, formData);
        if (!updatedJob) throw new Error();
        toast({
          title: "Job Updated",
          description: "Your job listing has been updated successfully.",
        });
      } else {
        const newJob = await createJob(formData);
        if (!newJob) throw new Error();
        toast({
          title: "Job Created",
          description: "Your job listing has been created successfully.",
        });
      }

      navigate("/employer/jobs");
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${
          isEditMode ? "update" : "create"
        } job listing.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl gradient-employer">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-employer-foreground" />
            </div>
            <span className="text-base sm:text-lg font-bold text-foreground">
              JobConnect
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/employer/jobs")}
          className="mb-4 sm:mb-6 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Job Listings
        </Button>

        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
            {isEditMode ? "Edit Job Listing" : "Create New Job Listing"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? "Update the details of your job listing."
              : "Fill in the details below to post a new job opening."}
          </p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl bg-card border border-border">
          {isLoadingJob ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-b-2 border-employer rounded-full" />
            </div>
          ) : (
            <JobForm
              job={job}
              isLoading={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/employer/jobs")}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployerJobForm;
