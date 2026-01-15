import { Phone, MapPin, Briefcase, FileText, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApplicantProfile } from "@/types/job";

interface ApplicantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApplicantProfile | null;
  isLoading: boolean;
  error: string | null;
}

const ApplicantProfileModal = ({
  isOpen,
  onClose,
  profile,
  isLoading,
  error,
}: ApplicantProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading profile...
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-8">{error}</div>
        ) : profile ? (
          <>
            <DialogHeader>
              <DialogTitle>Applicant Profile</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Experience */}
              <div className="flex items-start gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p>{profile.experience}</p>
              </div>

              <Separator />

              {/* Resume */}
              {profile.resumeUrl && (
                <Button
                  onClick={() =>
                    window.open(
                      `http://localhost:5000/${profile.resumeUrl.replace(
                        /\\/g,
                        "/"
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Resume
                </Button>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantProfileModal;
