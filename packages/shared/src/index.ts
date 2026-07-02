/**
 * Shared domain types and pure helpers used by BOTH the Next.js web app and
 * the NestJS API. Keep this package free of framework / runtime dependencies
 * so it can compile to plain JS that either side can import.
 */

/** The celebrant being honoured. Single source of truth for their name. */
export const CELEBRANT_NAME = "Grashan Fernando";
/** Public-facing event name, woven into the headline and invitation copy. */
export const EVENT_NAME = "Grashan's Birthday Celebration";

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
  venue: "Shangri-La Colombo- Spice Room",
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

/** Add `minutes` to an ISO timestamp, returning a new ISO 8601 string. */
export function addMinutesToIso(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

/** Details needed to create a calendar entry, independent of provider. */
export interface CalendarEvent {
  title: string;
  /** Optional longer note shown in the calendar entry's body. */
  description?: string;
  location: string;
  /** ISO 8601 start time. */
  start: string;
  /** ISO 8601 end time. */
  end: string;
}

/** Render an ISO time as a UTC calendar stamp: `YYYYMMDDTHHMMSSZ`. */
function toCalendarStamp(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

/** Escape reserved characters in ICS text values (RFC 5545). */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * "Add to Google Calendar" link — opens a prefilled event the guest can save
 * to their Google account in one tap. Times are sent as UTC stamps so the
 * entry lands at the correct local moment wherever the guest opens it.
 */
export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    location: event.location,
  });
  if (event.description) params.set("details", event.description);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * ICS (iCalendar) file body for the event — the format Apple Calendar (iPhone,
 * Mac), Outlook, and most other apps understand. Deliver it as a download so
 * the guest's device opens it in their default calendar app.
 */
export function buildIcsContent(event: CalendarEvent): string {
  const stamp = toCalendarStamp(event.start);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Grashan Birthday//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${stamp}-grashan-birthday@invitation`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${stamp}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
  ];
  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  }
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

/** Ordered list of valid scopes — drives dropdowns and validation. */
export const INVITATION_SCOPES: InvitationScope[] = [
  "single",
  "couple",
  "family",
];

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
export function buildInvitationMessage(
  name: string,
  scope: InvitationScope,
): string {
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

/**
 * A warm, personal note from the celebrant shown beneath the headline on the
 * invitation. Kept separate from `buildInvitationMessage` so the headline stays
 * short while this carries the heartfelt welcome; the wording adapts to scope.
 */
export function buildGreetingMessage(scope: InvitationScope): string {
  switch (scope) {
    case "couple":
      return "As I step into a new chapter and celebrate my 40th birthday, I would be truly honoured to share this special evening with you & your partner. Come join us for a night of laughter, warm company, meaningful moments, and memories worth keeping.";
    case "family":
      return "As I step into a new chapter and celebrate my 40th birthday, I would be truly honoured to share this special evening with you & your family. Come join us for a night of laughter, warm company, meaningful moments, and memories worth keeping.";
    case "single":
    default:
      return "As I step into a new chapter and celebrate my 40th birthday, I would be truly honoured to share this special evening with you. Come join us for a night of laughter, warm company, meaningful moments, and memories worth keeping.";
  }
}
