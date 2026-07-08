import type { ApiErrorPayload } from "@/types/notice";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function flattenFieldErrors(details?: ApiErrorPayload["details"]) {
  if (!details) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(details).map(([field, messages]) => [field, messages[0] ?? "Invalid value."]),
  );
}
