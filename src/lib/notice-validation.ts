import { z } from "zod";

export const noticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(140, "Title must be 140 characters or fewer."),
  body: z
    .string()
    .trim()
    .min(1, "Body is required.")
    .max(5000, "Body must be 5,000 characters or fewer."),
  category: z.enum(["EXAM", "EVENT", "GENERAL"], {
    error: "Choose a valid category.",
  }),
  priority: z.enum(["NORMAL", "URGENT"], {
    error: "Choose a valid priority.",
  }),
  publishDate: z
    .string()
    .trim()
    .min(1, "Publish date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Publish date must be valid.",
    }),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null))
    .refine((value) => value === null || z.url().safeParse(value).success, {
      message: "Image URL must be a valid URL.",
    })
    .refine(
      (value) => {
        if (value === null) {
          return true;
        }

        try {
          return new URL(value).protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "Image URL must use HTTPS.",
      },
    ),
});

export type ValidatedNoticeInput = z.infer<typeof noticeSchema>;

export const updateNoticeSchema = noticeSchema;

export const patchNoticeSchema = noticeSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one field must be provided.",
  },
);

export const idSchema = z.string().trim().min(1, "Notice id is required.");

export type NoticeRecord = {
  id: string;
  title: string;
  body: string;
  category: "EXAM" | "EVENT" | "GENERAL";
  priority: "NORMAL" | "URGENT";
  publishDate: Date;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toNoticeData(payload: ValidatedNoticeInput) {
  return {
    ...payload,
    publishDate: new Date(payload.publishDate),
  };
}

export function toPatchNoticeData(payload: Partial<ValidatedNoticeInput>) {
  return {
    ...payload,
    publishDate: payload.publishDate
      ? new Date(payload.publishDate)
      : undefined,
  };
}

export function serializeNotice(notice: NoticeRecord) {
  return {
    ...notice,
    publishDate: notice.publishDate.toISOString(),
    createdAt: notice.createdAt.toISOString(),
    updatedAt: notice.updatedAt.toISOString(),
  };
}
