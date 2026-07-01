import { CELEBRANT_NAME } from "@bday/shared";

/**
 * The pre-written invitation message shared with a guest — used for both the
 * WhatsApp share and the "copy" action so the two stay identical. The personal
 * invitation link is the single source of truth for the venue, date/time and
 * map, so the message points there instead of duplicating those details (which
 * could otherwise go stale when the admin edits the event).
 */
export function buildInviteMessage(name: string, link: string): string {
  return [
    `Hi ${name},`,
    "",
    "You are warmly invited to celebrate a very special birthday with us. Your presence would make the day even more memorable and meaningful.",
    "",
    "Please open your personal invitation using the link below:",
    link,
    "",
    "Looking forward to celebrating this special moment with you! 🎉✨",
    "",
    "Warm regards,",
    CELEBRANT_NAME,
  ].join("\n");
}

/** A `wa.me` share link that opens WhatsApp with the message pre-filled. */
export function buildWhatsAppUrl(name: string, link: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildInviteMessage(name, link))}`;
}
