import type { NextApiResponse } from "next";
import { ZodError } from "zod";

export function methodNotAllowed(
  res: NextApiResponse,
  allowedMethods: string[],
) {
  res.setHeader("Allow", allowedMethods);
  return res.status(405).json({ error: "Method not allowed." });
}

export function validationError(res: NextApiResponse, error: ZodError) {
  return res.status(400).json({
    error: "Validation failed.",
    details: error.flatten().fieldErrors,
  });
}

export function serverError(res: NextApiResponse, error: unknown) {
  console.error(error);
  return res.status(500).json({
    error: "Something went wrong. Please try again.",
  });
}
