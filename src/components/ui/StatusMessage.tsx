import { AlertCircle, Inbox, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";

type StatusMessageProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "empty" | "error" | "loading";
};

export function StatusMessage({
  title,
  message,
  actionLabel,
  onAction,
  tone = "empty",
}: StatusMessageProps) {
  const Icon =
    tone === "error" ? AlertCircle : tone === "loading" ? Loader2 : Inbox;

  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className={tone === "loading" ? "h-6 w-6 animate-spin" : "h-6 w-6"} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {message}
      </p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}
