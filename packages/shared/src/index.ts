/**
 * Shared domain types and pure helpers used by BOTH the Next.js web app and
 * the NestJS API. Keep this package free of framework / runtime dependencies
 * so it can compile to plain JS that either side can import.
 */

/** The celebrant being honoured. Single source of truth for their name. */
export const CELEBRANT_NAME = "Grushon Fernando";
/** Public-facing event name, woven into the headline and invitation copy. */
export const EVENT_NAME = "Grushon's Birthday Celebration";

export type InvitationScope = "single" | "couple" | "family";

export interface Guest {
  id: string;
  name: string;
  token: string;
  invitationScope: InvitationScope;
  /** Derived public invitation URL: `${SITE_URL}/invite/${token}` */
  formUrl: string;
  createdAt: string;
}

/** Payload accepted when creating a guest. */
export interface CreateGuestInput {
  name: string;
  invitationScope: InvitationScope;
}

/** Payload accepted when updating a guest. */
export interface UpdateGuestInput {
  name?: string;
  invitationScope?: InvitationScope;
}

/**
 * The event's fixed details (location + when), shared by every invitee. Set
 * once in code via `EVENT_DETAILS` — the public invite page reads it.
 */
export interface EventSettings {
  /** Location name shown to guests, e.g. "Shangri-La Hotel, Colombo". */
  venue: string;
  /**
   * Optional, more precise address used for the map lookup. Falls back to
   * `venue` when empty — so a clean display name and an exact map can differ.
   */
  address: string;
  /** Event date & time as an ISO 8601 string (the countdown target). */
  dateTime: string;
}

/** The single, fixed set of event details shown on every invitation. */
export const EVENT_DETAILS: EventSettings = {
  venue: "Shangri-La Colombo",
  address: "Shangri-La Hotel, Colombo",
  dateTime: "2026-07-18T18:00:00+05:30",
};

/** The text Google Maps should search for: precise address, else the venue. */
export function resolveMapQuery(settings: {
  venue: string;
  address?: string | null;
}): string {
  const address = settings.address?.trim();
  return address && address.length > 0 ? address : settings.venue;
}

/** Link that opens the location in the Google Maps app / site. */
export function buildMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Embeddable Google Maps URL for an <iframe> — needs no API key. */
export function buildMapEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

/**
 * Human-friendly "Sunday, 19 July 2026 · 7:00 PM" label. Passing an explicit
 * `timeZone` keeps the output identical on server and client (no hydration
 * mismatch) and shows the event's local time regardless of where it renders.
 */
export function formatEventDateTime(iso: string, timeZone?: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const tz = timeZone ? { timeZone } : {};
  const datePart = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...tz,
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...tz,
  }).format(date);
  return `${datePart} · ${timePart}`;
}

/** Ordered list of valid scopes — drives dropdowns and validation. */
export const INVITATION_SCOPES: InvitationScope[] = ["single", "couple", "family"];

/** Human-friendly labels for the admin UI. */
export const SCOPE_LABELS: Record<InvitationScope, string> = {
  single: "Single Person",
  couple: "Couple",
  family: "Family",
};

/** Short tagline used as a subtitle on the invitation page. */
export const SCOPE_TAGLINE: Record<InvitationScope, string> = {
  single: "An evening just for you",
  couple: "You & your partner",
  family: "You & your loved ones",
};

export function isInvitationScope(value: unknown): value is InvitationScope {
  return value === "single" || value === "couple" || value === "family";
}

/**
 * The headline message shown on the public invitation page. The wording
 * adapts to the guest's invitation scope.
 */
export function buildInvitationMessage(name: string, scope: InvitationScope): string {
  const guest = name.trim() || "there";
  switch (scope) {
    case "couple":
      return `Hi ${guest}, you and your partner are invited to ${EVENT_NAME}.`;
    case "family":
      return `Hi ${guest}, you and your family are invited to ${EVENT_NAME}.`;
    case "single":
    default:
      return `Hi ${guest}, you are invited to ${EVENT_NAME}.`;
  }
}
