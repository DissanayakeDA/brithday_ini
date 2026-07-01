/**
 * Centralised configuration: event details + environment-driven URLs.
 * Change event copy here once and it updates everywhere.
 */
import { CELEBRANT_NAME, EVENT_NAME } from "@bday/shared";

function clean(url: string | undefined, fallback: string): string {
  return (url ?? fallback).replace(/\/$/, "");
}

export const API_URL = clean(process.env.NEXT_PUBLIC_API_URL, "http://localhost:3001");
export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000");

export const EVENT = {
  title: EVENT_NAME,
  celebrant: CELEBRANT_NAME,
  /**
   * Fixed running order shown on the invite. Date & venue stay admin-set
   * (they vary per setup); this timeline is part of the event copy.
   */
  schedule: [
    { label: "Party", time: "6:00 PM – 11:45 PM" },
    { label: "Cake Cutting", time: "7:30 PM" },
    { label: "Dinner Buffet", time: "8:30 PM – 10:30 PM" },
  ],
} as const;

/**
 * How long the celebration runs, in minutes — used to set the end time on
 * calendar entries. Party runs 6:00 PM – 11:45 PM (5h 45m).
 */
export const EVENT_DURATION_MINUTES = 345;

/**
 * Timezone the event happens in. Used to format the date/time label and to
 * interpret the admin's date picker. Fixed because the audience is local
 * (Colombo, +05:30, no daylight saving) — keeps server/client output identical.
 */
export const EVENT_TIMEZONE = "Asia/Colombo";
/** Matching fixed UTC offset for `EVENT_TIMEZONE` (Asia/Colombo has no DST). */
export const EVENT_TZ_OFFSET = "+05:30";

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
