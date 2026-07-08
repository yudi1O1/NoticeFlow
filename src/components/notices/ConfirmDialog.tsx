import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Notice } from "@/types/notice";

type ConfirmDialogProps = {
  notice: Notice | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  notice,
  isDeleting,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!notice) {
    return null;
  }

  return (
    <div
      aria-labelledby="delete-title"
      aria-modal="true"
      className="fixed inset-0 z-40 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 id="delete-title" className="text-lg font-semibold text-slate-950">
              Delete this notice?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will permanently remove &quot;{notice.title}&quot;. This action cannot
              be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button disabled={isDeleting} onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button disabled={isDeleting} onClick={onConfirm} variant="danger">
            {isDeleting ? "Deleting..." : "Delete notice"}
          </Button>
        </div>
      </div>
    </div>
  );
}
