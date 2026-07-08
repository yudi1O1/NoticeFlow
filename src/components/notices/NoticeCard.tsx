import { CalendarDays, Edit3, Trash2 } from "lucide-react";
import clsx from "clsx";

import { Button } from "@/components/ui/Button";
import { CATEGORY_LABELS } from "@/constants/notices";
import type { Notice } from "@/types/notice";
import { formatDisplayDate } from "@/utils/date";

type NoticeCardProps = {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
};

export function NoticeCard({ notice, onEdit, onDelete }: NoticeCardProps) {
  const isUrgent = notice.priority === "URGENT";

  return (
    <article
      className={clsx(
        "overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
        isUrgent ? "border-red-200" : "border-slate-200",
      )}
    >
      {notice.imageUrl ? (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100">
          {/* User-entered image URLs load in the browser to avoid proxying arbitrary hosts through Next Image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={`Image for ${notice.title}`}
            className="h-full w-full object-cover"
            decoding="async"
            loading="lazy"
            referrerPolicy="no-referrer"
            src={notice.imageUrl}
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {CATEGORY_LABELS[notice.category]}
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
            {formatDisplayDate(notice.publishDate)}
          </time>
        </div>

        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
          <Button
            className="flex-1"
            onClick={() => onEdit(notice)}
            variant="secondary"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>
          <Button
            className="flex-1"
            onClick={() => onDelete(notice)}
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
