import { MapPin, Calendar, Edit, Trash2, FileText } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onViewApplications?: (job: Job) => void;
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

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const JobCard = ({
  job,
  onEdit,
  onDelete,
  onViewApplications,
}: JobCardProps) => {
  return (
    <div className="p-4 sm:p-5 rounded-lg sm:rounded-xl bg-card border border-border hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Job Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-foreground truncate mb-1">
          {job.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px] sm:max-w-none">
              {job.location}
            </span>
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

      {/* Action Buttons at the bottom */}
      <div className="flex gap-2 mt-4 flex-wrap justify-start">
        <Button
          variant="employer-outline"
          size="sm"
          onClick={() => onEdit(job)}
          className="flex-1 sm:flex-[0.4] md:flex-[0.25] lg:flex-[0.2] text-xs sm:text-sm"
        >
          <Edit className="w-3.5 h-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline">Edit</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(job)}
          className="flex-1 sm:flex-[0.4] md:flex-[0.25] lg:flex-[0.2] text-xs sm:text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3.5 h-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline">Delete</span>
        </Button>

        {onViewApplications && (
          <Button
            variant="employer"
            size="sm"
            onClick={() => onViewApplications(job)}
            className="flex-1 sm:flex-[0.8] md:flex-[0.25] lg:flex-[0.2] text-xs sm:text-sm"
          >
            <FileText className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Review Applications</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
