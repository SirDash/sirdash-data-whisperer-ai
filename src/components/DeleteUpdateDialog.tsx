import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export type DeleteUpdateTarget = {
  id: string;
  title: string;
};

type DeleteUpdateDialogProps = {
  target: DeleteUpdateTarget | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
};

const DeleteUpdateDialog = ({
  target,
  isPending,
  onClose,
  onConfirm,
}: DeleteUpdateDialogProps) => {
  return (
    <AlertDialog
      open={!!target}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this update?</AlertDialogTitle>
          <AlertDialogDescription>
            {target
              ? `"${target.title}" will be permanently removed. This cannot be undone.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              if (target) onConfirm(target.id);
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUpdateDialog;
