import { EVENT } from "./config";

/**
 * The pre-written WhatsApp invitation message for a guest. The personal
 * invitation link is the single source of truth for the venue, date/time and
 * map, so the message points there instead of duplicating those details (which
 * could otherwise go stale when the admin edits the event).
 */
export function buildWhatsAppMessage(name: string, link: string): string {
  return [
    `Hi ${name}, you are invited to the ${EVENT.title}.`,
    "",
    "Open your personal invitation for the date, venue and map:",
    link,
    "",
    "Please confirm your participation through the RSVP button.",
  ].join("\n");
}

/** A `wa.me` share link that opens WhatsApp with the message pre-filled. */
export function buildWhatsAppUrl(name: string, link: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(name, link))}`;
}
