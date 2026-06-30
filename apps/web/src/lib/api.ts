import type { CreateGuestInput, Guest, UpdateGuestInput } from "@bday/shared";
import { API_URL } from "./config";

/** Error carrying the HTTP status so callers can distinguish 404 from 500. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      ...init,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Is the API running?",
      0,
    );
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message) ? body.message.join(" ") : body.message;
      }
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const guestsApi = {
  list: () => request<Guest[]>("/guests"),
  getByToken: (token: string) => request<Guest>(`/guests/${encodeURIComponent(token)}`),
  create: (data: CreateGuestInput) =>
    request<Guest>("/guests", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: UpdateGuestInput) =>
    request<Guest>(`/guests/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ id: string }>(`/guests/${id}`, { method: "DELETE" }),
};
