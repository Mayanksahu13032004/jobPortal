import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Job } from "@/types/job";
import { Loader2 } from "lucide-react";

interface DeleteJobDialogProps {
  job: Job | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteJobDialog = ({
  job,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteJobDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">
            Delete Job Listing
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{job?.title}"
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isDeleting} className="mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteJobDialog;
