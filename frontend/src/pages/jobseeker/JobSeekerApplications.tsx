import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

type ApplicationStatus = "applied" | "reviewed" | "rejected" | "accepted";

interface AppliedJob {
  id: string;
  title: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  status: ApplicationStatus;
}

const JobSeekerApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view applications.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map backend data to frontend format, handle deleted jobs
        const mappedApplications: AppliedJob[] = res.data
          .filter((app: any) => app.job) // skip null/deleted jobs
          .map((app: any) => ({
            id: app._id,
            title: app.job?.title || "Job deleted",
            location: app.job?.location || "-",
            jobType: app.job?.jobType || "-",
            salaryMin: app.job?.salaryMin || 0,
            salaryMax: app.job?.salaryMax || 0,
            status: app.status, // 'applied' | 'reviewed' | 'rejected' | 'accepted'
          }));

        setApplications(mappedApplications);
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "applied":
        return (
          <span className="flex items-center gap-1 text-sm text-amber-600">
            <Clock className="w-4 h-4" /> Applied
          </span>
        );
      case "reviewed":
      case "accepted":
        return (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />{" "}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-sm text-red-600">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/jobseeker/home")}
          >
            Back
          </Button>
        </div>

        {applications.length === 0 ? (
          <p className="text-muted-foreground">
            You haven’t applied to any jobs yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl bg-card border border-border hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold mb-2">{job.title}</h2>

                <div className="flex items-center gap-3 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    <span>
                      {job.salaryMin && job.salaryMax
                        ? `${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div>{getStatusBadge(job.status)}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobSeekerApplications;
