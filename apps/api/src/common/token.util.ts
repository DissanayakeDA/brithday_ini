import { randomInt } from "node:crypto";
import type { InvitationScope } from "@bday/shared";

// Lowercase + digits, with ambiguous characters (0, 1, l, o) removed so the
// random suffix is easy to read / re-type if someone copies it by hand.
const SAFE_ALPHABET = "23456789abcdefghijkmnpqrstuvwxyz";

/**
 * Convert a guest name into a URL-safe slug.
 * e.g. "Nimal Perera" -> "nimal-perera", "Saman & Family" -> "saman-family"
 */
export function slugify(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return slug || "guest";
}

/** Cryptographically-random suffix from the safe alphabet, e.g. "a8x92". */
export function randomSuffix(length = 5): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += SAFE_ALPHABET[randomInt(SAFE_ALPHABET.length)];
  }
  return out;
}

/**
 * Build a unique-ish token for a guest. Uniqueness is ultimately guaranteed by
 * the DB unique constraint; the service retries on the rare collision.
 *
 * Pattern: `<name-slug>[-<scope>]-<random5>`
 *   single  -> "nimal-perera-a8x92"   (scope omitted)
 *   couple  -> "dinuka-couple-p9x21"
 *   family  -> "saman-family-k72q1"
 */
export function generateToken(name: string, scope: InvitationScope): string {
  const base = slugify(name);
  const scopePart = scope === "single" ? "" : `-${scope}`;
  return `${base}${scopePart}-${randomSuffix()}`;
}
