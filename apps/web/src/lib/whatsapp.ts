import { EVENT } from "./config";

/** The pre-written WhatsApp invitation message for a guest. */
export function buildWhatsAppMessage(name: string, link: string): string {
  return [
    `Hi ${name}, you are invited to a ${EVENT.title} at ${EVENT.venue} on ${EVENT.dateLabel}.`,
    "",
    "Open your personal invitation here:",
    link,
    "",
    "Please confirm your participation through the RSVP button.",
  ].join("\n");
}

/** A `wa.me` share link that opens WhatsApp with the message pre-filled. */
export function buildWhatsAppUrl(name: string, link: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(name, link))}`;
}
