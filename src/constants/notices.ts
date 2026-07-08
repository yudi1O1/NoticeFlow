import type { NoticeCategory, NoticePriority } from "@prisma/client";

export const NOTICE_CATEGORIES: NoticeCategory[] = ["EXAM", "EVENT", "GENERAL"];

export const NOTICE_PRIORITIES: NoticePriority[] = ["NORMAL", "URGENT"];

export const CATEGORY_LABELS: Record<NoticeCategory, string> = {
  EXAM: "Exam",
  EVENT: "Event",
  GENERAL: "General",
};

export const PRIORITY_LABELS: Record<NoticePriority, string> = {
  NORMAL: "Normal",
  URGENT: "Urgent",
};
