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
