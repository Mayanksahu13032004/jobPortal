import { useEffect, useState, useCallback } from "react";
import { Job, JobFormData } from "@/types/job";
import { apiFetch } from "@/lib/api";


export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Separate loading states
  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const mapJob = (job: any): Job => ({
    id: job._id,
    title: job.title,
    description: job.description,
    qualifications: job.qualifications,
    responsibilities: job.responsibilities,
    location: job.location,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    employerId: typeof job.employer === "string" ? job.employer : job.employer._id,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  });


  const fetchJobs = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await apiFetch("/jobs");
      setJobs(data.map(mapJob));
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  //Get job
  const getJob = useCallback(async (jobId: string): Promise<Job | null> => {
    try {
      const data = await apiFetch(`/jobs/${jobId}`);
      return mapJob(data);
    } catch (err) {
      console.error("Failed to get job:", err);
      return null;
    }
  }, []);
  //Create Job

  const createJob = useCallback(async (formData: JobFormData): Promise<Job | null> => {
    setIsCreating(true);
    try {
      const res = await apiFetch("/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          qualifications: formData.qualifications,
          responsibilities: formData.responsibilities,
        }),
      });

      const newJob = mapJob(res.job);
      setJobs((prev) => [newJob, ...prev]);
      return newJob;
    } catch (err) {
      console.error("Create job failed:", err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateJob = useCallback(
    async (jobId: string, formData: JobFormData): Promise<Job | null> => {
      setIsUpdating(true);
      try {
        const res = await apiFetch(`/jobs/${jobId}`, {
          method: "PUT",
          body: JSON.stringify({
            ...formData,
            qualifications: formData.qualifications,
            responsibilities: formData.responsibilities,
          }),
        });

        const updatedJob = mapJob(res.job);

        setJobs((prev) =>
          prev.map((job) => (job._id === jobId ? updatedJob : job))
        );

        return updatedJob;
      } catch (err) {
        console.error("Update job failed:", err);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );


  //Delete job
  const deleteJob = useCallback(async (jobId: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      await apiFetch(`/jobs/${jobId}`, { method: "DELETE" });
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      return true;
    } catch (err) {
      console.error("Delete job failed:", err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    jobs,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    fetchJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
  };
};
