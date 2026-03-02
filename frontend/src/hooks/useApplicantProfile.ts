import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import type { ApplicantProfile } from "@/types/job";

export const useApplicantProfile = () => {
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicantProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}/applicants/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
      return res.data;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch applicant profile"
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setError(null);
  };

  return {
    profile,
    isLoading,
    error,
    fetchApplicantProfile,
    clearProfile,
  };
};
