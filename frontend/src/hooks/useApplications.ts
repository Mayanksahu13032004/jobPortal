import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ApplicationStatus } from "@/types/job";

// Shape of the raw application returned by the API.
interface RawApplication {
  _id?: string;
  job?: string | { _id?: string };
  applicant?: { _id?: string; name?: string; email?: string };
  user?: { _id?: string; name?: string; email?: string };
  resume?: string;
  skills?: string[];
  experience?: string;
  status?: string;
  createdAt?: string;
  userId?: string;
}

// Normalized application shape used in the employer UI.
export interface Application {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  skills: string[];
  experience: string;

  jobId?: string;
  _id?: string;
  createdAt?: string;

  applicant?: { _id?: string; name?: string; email?: string };
  user?: { _id?: string; name?: string; email?: string };
  resumeUrl?: string;

  userId?: string;
  candidateName?: string;
  email?: string;
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

  const mapApplication = (app: RawApplication): Application => {
    const id = app._id ?? "";
    const createdAt = app.createdAt ?? "";
    const status = mapStatus(app.status ?? "applied");

    const jobId =
      typeof app.job === "string"
        ? app.job
        : app.job?._id;

    const applicant = app.applicant ?? undefined;
    const user = app.user ?? undefined;

    const candidateName =
      applicant?.name ??
      user?.name ??
      undefined;

    const email =
      applicant?.email ??
      user?.email ??
      undefined;

    const userId =
      app.userId ??
      applicant?._id ??
      user?._id ??
      undefined;

    return {
      id,
      _id: app._id,
      jobId,
      applicant,
      user,
      resumeUrl: app.resume || undefined,
      skills: app.skills ?? [],
      experience: app.experience ?? "",
      status,
      appliedAt: createdAt,
      createdAt,
      userId,
      candidateName,
      email,
    };
  };


  const fetchApplications = useCallback(async () => {
    if (!jobId) {
      console.warn(" jobId is null or undefined — cannot fetch applications");
      setApplications([]);
      return;
    }

    setIsLoading(true);
    try {

      const data = await apiFetch(`/applications/applicants/${jobId}`);
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
