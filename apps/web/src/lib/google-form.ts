import type { InvitationScope } from "@bday/shared";
import { GOOGLE_FORM } from "./config";

/**
 * Build a Google Form RSVP URL with the guest's details pre-filled.
 * Returns `null` when no form is configured (so the UI can fall back).
 *
 * Google pre-fill format: <viewform-url>?usp=pp_url&entry.123=Value
 */
export function buildRsvpUrl(guest: {
  name: string;
  token: string;
  invitationScope: InvitationScope;
}): string | null {
  if (!GOOGLE_FORM.baseUrl) return null;

  let url: URL;
  try {
    url = new URL(GOOGLE_FORM.baseUrl);
  } catch {
    return null;
  }

  url.searchParams.set("usp", "pp_url");
  if (GOOGLE_FORM.entryName) url.searchParams.set(GOOGLE_FORM.entryName, guest.name);
  if (GOOGLE_FORM.entryToken) url.searchParams.set(GOOGLE_FORM.entryToken, guest.token);
  if (GOOGLE_FORM.entryScope) {
    url.searchParams.set(GOOGLE_FORM.entryScope, guest.invitationScope);
  }
  return url.toString();
}
