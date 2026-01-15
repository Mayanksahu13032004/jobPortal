import { Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobApplication, ApplicationStatus } from "@/types/job";

interface ApplicationCardProps {
  application: JobApplication;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  isUpdating?: boolean;
  onViewProfile: () => void;
}

// date formatting
const formatDate = (date?: string | null) => {
  if (!date) return "Unknown";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "Unknown"
    : d.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const ApplicationCard = ({
  application,
  onStatusChange,
  isUpdating,
  onViewProfile,
}: ApplicationCardProps) => {
  const statusText =
    application.status.charAt(0).toUpperCase() + application.status.slice(1);

  return (
    <div className="p-5 rounded-xl border bg-card space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            {application.applicant?.name || application.user?.name || "Unknown"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {application.applicant?.email ||
              application.user?.email ||
              "Unknown"}
          </p>
        </div>

        {/* Status Badge */}
        <Badge
          variant={
            application.status === "Accepted"
              ? "success"
              : application.status === "Rejected"
              ? "destructive"
              : "secondary"
          }
        >
          {statusText}
        </Badge>
      </div>

      {/* Applied Date */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="w-4 h-4" />
        Applied on {formatDate(application.createdAt || application.appliedAt)}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-3 border-t">
        <Button size="sm" onClick={onViewProfile}>
          <FileText className="w-4 h-4 mr-1" />
          View Profile
        </Button>

        {/* Show Accept/Reject only if pending */}
        {application.status === "Pending" && (
          <>
            <Button
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(application._id || application.id, "Accepted")
              }
            >
              Accept
            </Button>
            <Button
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(application._id || application.id, "Rejected")
              }
            >
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
