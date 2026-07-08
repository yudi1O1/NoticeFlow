import type { ApiErrorPayload, Notice, NoticeInput } from "@/types/notice";

export class ApiError extends Error {
  details?: ApiErrorPayload["details"];
  status: number;

  constructor(message: string, status: number, details?: ApiErrorPayload["details"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  const payload = (await response.json().catch(() => null)) as ApiErrorPayload | null;
  throw new ApiError(
    payload?.error ?? "Request failed.",
    response.status,
    payload?.details,
  );
}

export async function fetchNotices() {
  const response = await fetch("/api/notices");
  const payload = await parseResponse<{ notices: Notice[] }>(response);
  return payload.notices;
}

export async function createNotice(input: NoticeInput) {
  const response = await fetch("/api/notices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await parseResponse<{ notice: Notice }>(response);
  return payload.notice;
}

export async function updateNotice(id: string, input: NoticeInput) {
  const response = await fetch(`/api/notices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await parseResponse<{ notice: Notice }>(response);
  return payload.notice;
}

export async function deleteNotice(id: string) {
  const response = await fetch(`/api/notices/${id}`, {
    method: "DELETE",
  });
  await parseResponse<void>(response);
}
