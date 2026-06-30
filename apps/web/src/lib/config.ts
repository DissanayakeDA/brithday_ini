/**
 * Centralised configuration: event details + environment-driven URLs.
 * Change event copy here once and it updates everywhere.
 */

function clean(url: string | undefined, fallback: string): string {
  return (url ?? fallback).replace(/\/$/, "");
}

export const API_URL = clean(process.env.NEXT_PUBLIC_API_URL, "http://localhost:3001");
export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000");

export const EVENT = {
  title: "40th Birthday Celebration",
  dateLabel: "19th July",
  /** ISO date/time used by the countdown timer. */
  dateISO: process.env.NEXT_PUBLIC_EVENT_DATE ?? "2026-07-19T19:00:00+05:30",
  venue: "Shangri-La Hotel, Colombo",
  mapsUrl:
    process.env.NEXT_PUBLIC_MAPS_URL ??
    "https://www.google.com/maps/search/?api=1&query=Shangri-La+Hotel+Colombo",
} as const;

export const GOOGLE_FORM = {
  baseUrl: process.env.NEXT_PUBLIC_GOOGLE_FORM_BASE_URL ?? "",
  entryName: process.env.NEXT_PUBLIC_GF_ENTRY_NAME ?? "",
  entryToken: process.env.NEXT_PUBLIC_GF_ENTRY_TOKEN ?? "",
  entryScope: process.env.NEXT_PUBLIC_GF_ENTRY_SCOPE ?? "",
} as const;

/** Build the public invitation URL for a token. */
export function inviteUrl(token: string): string {
  return `${SITE_URL}/invite/${token}`;
}
