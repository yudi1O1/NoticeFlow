import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { methodNotAllowed, serverError, validationError } from "@/lib/api-response";
import {
  idSchema,
  patchNoticeSchema,
  serializeNotice,
  toNoticeData,
  toPatchNoticeData,
  updateNoticeSchema,
} from "@/lib/notice-validation";
import { prisma } from "@/lib/prisma";

const ALLOWED_METHODS = ["GET", "PUT", "PATCH", "DELETE"];

function getId(req: NextApiRequest) {
  return idSchema.parse(req.query.id);
}

function isNotFound(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const id = getId(req);

    if (req.method === "GET") {
      const notice = await prisma.notice.findUnique({ where: { id } });

      if (!notice) {
        return res.status(404).json({ error: "Notice not found." });
      }

      return res.status(200).json({ notice: serializeNotice(notice) });
    }

    if (req.method === "PUT") {
      const payload = updateNoticeSchema.parse(req.body);

      const notice = await prisma.notice.update({
        where: { id },
        data: toNoticeData(payload),
      });

      return res.status(200).json({ notice: serializeNotice(notice) });
    }

    if (req.method === "PATCH") {
      const payload = patchNoticeSchema.parse(req.body);

      const notice = await prisma.notice.update({
        where: { id },
        data: toPatchNoticeData(payload),
      });

      return res.status(200).json({ notice: serializeNotice(notice) });
    }

    if (req.method === "DELETE") {
      await prisma.notice.delete({ where: { id } });
      return res.status(204).end();
    }

    return methodNotAllowed(res, ALLOWED_METHODS);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(res, error);
    }

    if (isNotFound(error)) {
      return res.status(404).json({ error: "Notice not found." });
    }

    return serverError(res, error);
  }
}
