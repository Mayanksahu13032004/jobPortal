import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Job, JobFormData, JobFormErrors } from "@/types/job";

interface JobFormProps {
  job?: Job | null;
  isLoading: boolean;
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
}

const initialFormData: JobFormData = {
  title: "",
  description: "",
  qualifications: "",
  responsibilities: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
};

const JobForm = ({ job, isLoading, onSubmit, onCancel }: JobFormProps) => {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [errors, setErrors] = useState<JobFormErrors>({});

  // Normalize job data for editing
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        qualifications: Array.isArray(job.qualifications)
          ? job.qualifications.join("\n")
          : job.qualifications,
        responsibilities: Array.isArray(job.responsibilities)
          ? job.responsibilities.join("\n")
          : job.responsibilities,
        location: job.location,
        salaryMin: job.salaryMin.toString(),
        salaryMax: job.salaryMax.toString(),
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [job]);

  const validateForm = (): boolean => {
    const newErrors: JobFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    if (!formData.qualifications.trim()) {
      newErrors.qualifications = "Qualifications are required";
    } else if (formData.qualifications.length > 1000) {
      newErrors.qualifications =
        "Qualifications must be less than 1000 characters";
    }

    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = "Responsibilities are required";
    } else if (formData.responsibilities.length > 1000) {
      newErrors.responsibilities =
        "Responsibilities must be less than 1000 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.length > 100) {
      newErrors.location = "Location must be less than 100 characters";
    }

    const minSalary = Number(formData.salaryMin);
    const maxSalary = Number(formData.salaryMax);

    if (!formData.salaryMin.trim()) {
      newErrors.salaryMin = "Minimum salary is required";
    } else if (isNaN(minSalary) || minSalary < 0) {
      newErrors.salaryMin = "Please enter a valid salary";
    }

    if (!formData.salaryMax.trim()) {
      newErrors.salaryMax = "Maximum salary is required";
    } else if (isNaN(maxSalary) || maxSalary < 0) {
      newErrors.salaryMax = "Please enter a valid salary";
    } else if (maxSalary < minSalary) {
      newErrors.salaryMax = "Maximum salary must be greater than minimum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        qualifications: formData.qualifications
          .split("\n")
          .map((q) => q.trim())
          .filter(Boolean),
        responsibilities: formData.responsibilities
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof JobFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      {/* Job Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm sm:text-base">
          Job Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="e.g., Senior Software Engineer"
          value={formData.title}
          onChange={handleChange}
          className={`h-10 sm:h-11 text-sm sm:text-base ${
            errors.title ? "border-destructive" : ""
          }`}
        />
        {errors.title && (
          <p className="text-xs sm:text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm sm:text-base">
          Job Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide a detailed description of the job role..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`text-sm sm:text-base resize-none ${
            errors.description ? "border-destructive" : ""
          }`}
        />
        {errors.description && (
          <p className="text-xs sm:text-sm text-destructive">
            {errors.description}
          </p>
        )}
      </div>

      {/* Qualifications */}
      <div className="space-y-2">
        <Label htmlFor="qualifications" className="text-sm sm:text-base">
          Qualifications <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="qualifications"
          name="qualifications"
          placeholder="List the required qualifications and skills, one per line..."
          value={formData.qualifications}
          onChange={handleChange}
          rows={3}
          className={`text-sm sm:text-base resize-none ${
            errors.qualifications ? "border-destructive" : ""
          }`}
        />
        {errors.qualifications && (
          <p className="text-xs sm:text-sm text-destructive">
            {errors.qualifications}
          </p>
        )}
      </div>

      {/* Responsibilities */}
      <div className="space-y-2">
        <Label htmlFor="responsibilities" className="text-sm sm:text-base">
          Responsibilities <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="responsibilities"
          name="responsibilities"
          placeholder="Outline the key responsibilities of this role, one per line..."
          value={formData.responsibilities}
          onChange={handleChange}
          rows={3}
          className={`text-sm sm:text-base resize-none ${
            errors.responsibilities ? "border-destructive" : ""
          }`}
        />
        {errors.responsibilities && (
          <p className="text-xs sm:text-sm text-destructive">
            {errors.responsibilities}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm sm:text-base">
          Job Location <span className="text-destructive">*</span>
        </Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="e.g., New York, NY or Remote"
          value={formData.location}
          onChange={handleChange}
          className={`h-10 sm:h-11 text-sm sm:text-base ${
            errors.location ? "border-destructive" : ""
          }`}
        />
        {errors.location && (
          <p className="text-xs sm:text-sm text-destructive">
            {errors.location}
          </p>
        )}
      </div>

      {/* Salary Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salaryMin" className="text-sm sm:text-base">
            Minimum Salary (₹) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="salaryMin"
            name="salaryMin"
            type="number"
            min="0"
            placeholder="50000"
            value={formData.salaryMin}
            onChange={handleChange}
            className={`h-10 sm:h-11 text-sm sm:text-base ${
              errors.salaryMin ? "border-destructive" : ""
            }`}
          />
          {errors.salaryMin && (
            <p className="text-xs sm:text-sm text-destructive">
              {errors.salaryMin}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryMax" className="text-sm sm:text-base">
            Maximum Salary (₹) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="salaryMax"
            name="salaryMax"
            type="number"
            min="0"
            placeholder="80000"
            value={formData.salaryMax}
            onChange={handleChange}
            className={`h-10 sm:h-11 text-sm sm:text-base ${
              errors.salaryMax ? "border-destructive" : ""
            }`}
          />
          {errors.salaryMax && (
            <p className="text-xs sm:text-sm text-destructive">
              {errors.salaryMax}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="employer"
          disabled={isLoading}
          className="w-full sm:flex-1 order-1 sm:order-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {job ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{job ? "Update Job" : "Create Job"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
