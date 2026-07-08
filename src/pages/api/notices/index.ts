import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

import { methodNotAllowed, serverError, validationError } from "@/lib/api-response";
import {
  noticeSchema,
  serializeNotice,
  toNoticeData,
} from "@/lib/notice-validation";
import { prisma } from "@/lib/prisma";

const ALLOWED_METHODS = ["GET", "POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "desc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
      });

      return res.status(200).json({ notices: notices.map(serializeNotice) });
    }

    if (req.method === "POST") {
      const payload = noticeSchema.parse(req.body);

      const notice = await prisma.notice.create({
        data: toNoticeData(payload),
      });

      return res.status(201).json({ notice: serializeNotice(notice) });
    }

    return methodNotAllowed(res, ALLOWED_METHODS);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(res, error);
    }

    return serverError(res, error);
  }
}
