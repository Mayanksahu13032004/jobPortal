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
  jobType: string;
  salaryMin: number;
  salaryMax: number;
}

const JobSeekerJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/jobs/${jobId}`
        );
        setJob(response.data);
      } catch (err: any) {
        console.error(err);
        if (err.response && err.response.status === 404) {
          setError("Job not found.");
        } else {
          setError("Failed to fetch job details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{error || "Job not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{job.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm mb-6">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-primary" />
              <span>{job.jobType}</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span>
                ₹{job.salaryMin.toLocaleString()} – ₹
                {job.salaryMax.toLocaleString()}
              </span>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Job Description</h2>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Qualifications</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {job.qualifications.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {job.responsibilities.map((r, index) => (
                <li key={index}>{r}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerJobDetails;
