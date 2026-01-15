export interface Job {
  id: string;
  title: string;
  description: string;
  qualifications: string;
  responsibilities: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  employerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  description: string;
  qualifications: string;
  responsibilities: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
}

export interface JobFormErrors {
  title?: string;
  description?: string;
  qualifications?: string;
  responsibilities?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
}

export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

export interface JobApplication {
  id: string;
  userId: string;
  candidateName: string;
  email: string;
  skills: string[];
  experience: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ApplicantProfile {
  phone: string;
  location: string;
  skills: string[];
  experience: string;
  resumeUrl: string;
}
