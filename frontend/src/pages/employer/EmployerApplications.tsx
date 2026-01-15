import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  LogOut,
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
import { useApplications } from "@/hooks/useApplications";
import { useJobs } from "@/hooks/useJobs";
import { ApplicationStatus } from "@/types/job";
import ApplicationCard from "@/components/employer/ApplicationCard";

import { useApplicantProfile } from "@/hooks/useApplicantProfile";
import ApplicantProfileModal from "@/components/employer/ApplicantProfileModal";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const EmployerApplications = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [user, setUser] = useState<UserData | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { applications, isLoading, updateApplicationStatus } = useApplications(
    jobId || null
  );

  const { jobs, isFetching: jobsLoading } = useJobs();
  const currentJob = jobs.find((job) => job.id === jobId);

  const {
    profile,
    isLoading: isProfileLoading,
    error: profileError,
    fetchApplicantProfile,
    clearProfile,
  } = useApplicantProfile();

  //Auth
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return navigate("/employer/login");

    const parsed: UserData = JSON.parse(storedUser);

    if (parsed.role !== "employer") {
      toast({
        title: "Access Denied",
        description: "Employers only",
        variant: "destructive",
      });
      return navigate("/jobseeker/login");
    }

    setUser(parsed);
  }, [navigate]);

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  // STATUS UPDATE
  const handleStatusChange = async (
    applicationId: string,
    newStatus: ApplicationStatus
  ) => {
    setUpdatingId(applicationId);

    const success = await updateApplicationStatus(applicationId, newStatus);

    toast({
      title: success ? "Status Updated" : "Error",
      description: success
        ? `Application marked as ${newStatus}`
        : "Failed to update status",
      variant: success ? "default" : "destructive",
    });

    setUpdatingId(null);
  };

  //VIEW PROFILE
  const handleViewProfile = async (application: any) => {
    //  Use the correct field from your API
    const applicantUserId =
      application?.applicant?._id ||
      application?.user?._id ||
      application.userId;

    if (!applicantUserId) {
      toast({
        title: "Error",
        description: "Applicant user ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsProfileModalOpen(true);
    await fetchApplicantProfile(applicantUserId);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    clearProfile();
  };

  if (!user || jobsLoading) return null;

  const acceptedCount = applications.filter(
    (a) => a.status.toLowerCase() === "accepted"
  ).length;

  const pendingCount = applications.filter(
    (a) => a.status.toLowerCase() === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER  */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-employer">
              <Building2 className="w-5 h-5 text-employer-foreground" />
            </div>
            <span className="font-bold text-lg">JobConnect</span>
          </div>

          <div className="hidden sm:flex gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/employer/profile")}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/employer/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/*  MAIN  */}
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/employer/jobs")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <h1 className="text-2xl font-bold mb-1">Applications</h1>
        {currentJob && (
          <p className="text-muted-foreground mb-6">{currentJob.title}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Stat label="Total" value={applications.length} />
          <Stat label="Accepted" value={acceptedCount} color="text-green-600" />
          <Stat label="Pending" value={pendingCount} color="text-yellow-600" />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
          </div>
        ) : applications.length === 0 ? (
          <EmptyState />
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app._id || app.id} //  Unique key
              application={app}
              onStatusChange={handleStatusChange}
              isUpdating={updatingId === (app._id || app.id)}
              onViewProfile={() => handleViewProfile(app)}
            />
          ))
        )}
      </main>

      {/*  MODAL  */}
      <ApplicantProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        profile={profile}
        isLoading={isProfileLoading}
        error={profileError}
      />
    </div>
  );
};

export default EmployerApplications;

/*  HELPERS */
const Stat = ({ label, value, color = "" }: any) => (
  <div className="p-4 border rounded-lg text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <FileText className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
    <h2 className="font-semibold text-lg">No Applications Yet</h2>
    <p className="text-muted-foreground">
      Candidates will appear here once they apply
    </p>
  </div>
);
