/**
 * Shared domain types and pure helpers used by BOTH the Next.js web app and
 * the NestJS API. Keep this package free of framework / runtime dependencies
 * so it can compile to plain JS that either side can import.
 */

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
      return `Hi ${guest}, you and your partner are invited to the 40th Birthday Celebration.`;
    case "family":
      return `Hi ${guest}, you and your family are invited to the 40th Birthday Celebration.`;
    case "single":
    default:
      return `Hi ${guest}, you are invited to the 40th Birthday Celebration.`;
  }
}
