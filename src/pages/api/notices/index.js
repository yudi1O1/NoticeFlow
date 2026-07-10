import { z, ZodError } from "zod";

import { prisma } from "../../../lib/prisma";

const imageUrlSchema = z.preprocess(
  (value) => (value === null ? undefined : value),
  z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null))
    .refine((value) => value === null || z.url().safeParse(value).success, {
      message: "Image URL must be a valid URL.",
    })
    .refine((value) => value === null || isHttpsUrl(value), {
      message: "Image URL must use HTTPS.",
    }),
);

const noticeSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(140),
  body: z.string().trim().min(1, "Body is required.").max(5000),
  category: z.enum(["EXAM", "EVENT", "GENERAL"]),
  priority: z.enum(["NORMAL", "URGENT"]),
  publishDate: z
    .string()
    .trim()
    .min(1, "Publish date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Publish date must be valid.",
    }),
  imageUrl: imageUrlSchema,
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "desc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
      });

      return res.status(200).json({ notices: notices.map(formatNotice) });
    }

    if (req.method === "POST") {
      const data = noticeSchema.parse(req.body);

      const notice = await prisma.notice.create({
        data: {
          ...data,
          publishDate: new Date(data.publishDate),
        },
      });

      return res.status(201).json({ notice: formatNotice(notice) });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Validation failed.",
        details: error.flatten().fieldErrors,
      });
    }

    console.error(error);
    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function formatNotice(notice) {
  return {
    ...notice,
    publishDate: notice.publishDate.toISOString(),
    createdAt: notice.createdAt.toISOString(),
    updatedAt: notice.updatedAt.toISOString(),
  };
}
