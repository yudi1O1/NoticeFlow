import type { NoticeCategory, NoticePriority } from "@prisma/client";

export type Notice = {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishDate: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NoticeFormValues = {
  title: string;
  body: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishDate: string;
  imageUrl: string;
};

export type NoticeInput = {
  title: string;
  body: string;
  category: NoticeCategory;
  priority: NoticePriority;
  publishDate: string;
  imageUrl?: string | null;
};

export type ApiErrorPayload = {
  error: string;
  details?: Record<string, string[]>;
};
