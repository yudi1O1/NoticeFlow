import { CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

export type ToastState = {
  tone: "success" | "error";
  message: string;
} | null;

type ToastProps = {
  toast: ToastState;
};

export function Toast({ toast }: ToastProps) {
  if (!toast) {
    return null;
  }

  const Icon = toast.tone === "success" ? CheckCircle2 : XCircle;

  return (
    <div
      className={clsx(
        "fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-soft",
        toast.tone === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-900",
      )}
      role="status"
    >
      <Icon className="h-5 w-5 shrink-0" />
      {toast.message}
    </div>
  );
}
