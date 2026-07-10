import { CalendarDays, Edit3, Trash2 } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const categoryLabels = {
  EXAM: "Exam",
  EVENT: "Event",
  GENERAL: "General",
};

export function NoticeCard({ notice, onEdit, onDelete }) {
  const isUrgent = notice.priority === "URGENT";

  return (
    <article
      className={clsx(
        "overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
        isUrgent ? "border-red-200" : "border-slate-200",
      )}
    >
      {notice.imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          <Image
            alt={`Image for ${notice.title}`}
            className="h-full w-full object-cover"
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={notice.imageUrl}
            unoptimized
          />
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {categoryLabels[notice.category]}
          </span>
          {isUrgent ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Urgent
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-lg font-semibold leading-7 text-slate-950">
          {notice.title}
        </h3>
        <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
          {notice.body}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays className="h-4 w-4" />
          <time dateTime={notice.publishDate}>
            {formatDate(notice.publishDate)}
          </time>
        </div>

        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
          <button
            className="btn-secondary flex-1"
            onClick={() => onEdit(notice)}
            type="button"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>
          <button
            className="btn-ghost flex-1"
            onClick={() => onDelete(notice)}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
