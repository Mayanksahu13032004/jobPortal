import { MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

// Format salary in INR
const formatSalary = (min: number, max: number) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

// Format createdAt date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const JobCard = ({ job, onEdit, onDelete }: JobCardProps) => {
  return (
    <div className="p-4 sm:p-5 rounded-lg sm:rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          {/* Job Title */}
          <h3 className="text-base sm:text-lg font-semibold text-foreground truncate mb-1">
            {job.title}
          </h3>

          {/* Job Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {job.description}
          </p>

          {/* Job Details: Location, Salary, Date */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px] sm:max-w-none">{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaRupeeSign size={14} />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:flex-col sm:gap-2">
          <Button
            variant="employer-outline"
            size="sm"
            onClick={() => onEdit(job)}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            <Edit className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(job)}
            className="flex-1 sm:flex-none text-xs sm:text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
