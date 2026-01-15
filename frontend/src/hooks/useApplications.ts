import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ApplicationStatus, JobApplication } from "@/types/job";

export interface Application extends JobApplication {
  applicant?: { name?: string; email?: string };
}

const mapStatus = (status: string): ApplicationStatus => {
  switch (status.toLowerCase()) {
    case "applied":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    default:
      return "Pending";
  }
};

export const useApplications = (jobId: string | null) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const mapApplication = (app: any): Application => ({
    id: app._id,
    jobId: typeof app.job === "string" ? app.job : app.job?._id,
    applicant: app.applicant ?? {},
    resumeUrl: app.resume || undefined,
    skills: app.skills ?? [],
    experience: app.experience ?? "",
    status: mapStatus(app.status),
    appliedAt: app.createdAt,
  });


  const fetchApplications = useCallback(async () => {
    if (!jobId) {
      console.warn(" jobId is null or undefined — cannot fetch applications");
      setApplications([]);
      return;
    }

    setIsLoading(true);
    try {

      const data = await apiFetch(`/applications/applicants/${jobId}`)


      const apps = Array.isArray(data.applications) ? data.applications : data;

      setApplications(Array.isArray(apps) ? apps.map(mapApplication) : []);
    } catch (error) {
      console.error(" Failed to fetch applications:", error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);


  const updateApplicationStatus = useCallback(
    async (applicationId: string, status: ApplicationStatus): Promise<boolean> => {
      setIsUpdating(true);
      try {
        console.log(`Updating application ${applicationId} to status: ${status}`);

        await apiFetch(`/applications/${applicationId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        });

        setApplications((prev) =>
          prev.map((app) =>
            (app._id === applicationId || app.id === applicationId)
              ? { ...app, status }
              : app
          )
        );

        return true;
      } catch (error) {
        console.error("Failed to update application status:", error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );


  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    isLoading,
    isUpdating,
    fetchApplications,
    updateApplicationStatus,
  };
};
