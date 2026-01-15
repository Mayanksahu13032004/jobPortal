import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Briefcase, IndianRupee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Job {
  _id: string;
  title: string;
  description: string;
  qualifications: string[];
  responsibilities: string[];
  location: string;
  jobType?: string;
  salaryMin: number;
  salaryMax: number;
}

interface Application {
  _id: string;
  job: Job | null;
  status: "applied" | "accepted" | "rejected";
}

const JobSeekerJobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  const token = sessionStorage.getItem("token");

  const appliedApplication = applications.find((app) => app.job?._id === jobId);

  const isApplied = Boolean(appliedApplication);

  // Normalize backend status
  const normalizedStatus =
    appliedApplication?.status === "applied"
      ? "pending"
      : appliedApplication?.status;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobReq = axios.get(`http://localhost:5000/api/jobs/${jobId}`);

        const appReq = axios.get(
          `http://localhost:5000/api/applications/my-applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const [jobRes, appRes] = await Promise.all([jobReq, appReq]);

        setJob(jobRes.data);
        setApplications(appRes.data);
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? "Job not found."
            : "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId && token) fetchData();
  }, [jobId, token]);

  const handleApply = async () => {
    if (!token || !job?._id) {
      alert("Please login to apply.");
      return;
    }

    try {
      setApplying(true);

      await axios.post(
        `http://localhost:5000/api/applications/apply/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Applied successfully");

      //  Update local state safely
      setApplications((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          job: { _id: job._id } as Job,
          status: "applied",
        },
      ]);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading job details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="p-6 rounded-xl bg-card border border-border">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              {job.location}
            </div>

            {job.jobType && (
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-primary" />
                {job.jobType}
              </div>
            )}

            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-primary" />₹
              {job.salaryMin.toLocaleString()} – ₹
              {job.salaryMax.toLocaleString()}
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Job Description</h2>
            <p className="text-muted-foreground">{job.description}</p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Qualifications</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {job.qualifications.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          {/*  Apply / Status */}
          {isApplied ? (
            <div className="flex items-center gap-3">
              <Button disabled variant="secondary">
                Already Applied
              </Button>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  normalizedStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : normalizedStatus === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {normalizedStatus?.toUpperCase()}
              </span>
            </div>
          ) : (
            <Button onClick={handleApply} disabled={applying}>
              {applying ? "Applying..." : "Apply Now"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobSeekerJobDetails;
