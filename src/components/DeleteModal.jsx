import { AlertTriangle } from "lucide-react";

export function DeleteModal({ notice, isDeleting, onCancel, onConfirm }) {
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
              This will permanently remove &quot;{notice.title}&quot;. This action
              cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="btn-secondary"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn-danger"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "Deleting..." : "Delete notice"}
          </button>
        </div>
      </div>
    </div>
  );
}
