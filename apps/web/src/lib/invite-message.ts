/**
 * Re-exports the shared, scope-aware invitation copy so web components can
 * import everything invitation-related from one place.
 */
export {
  buildInvitationMessage,
  SCOPE_LABELS,
  SCOPE_TAGLINE,
  INVITATION_SCOPES,
  isInvitationScope,
} from "@bday/shared";
export type { InvitationScope, Guest } from "@bday/shared";
