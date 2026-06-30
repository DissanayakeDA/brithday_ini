import { Heart, User, Users } from "lucide-react";
import { SCOPE_LABELS, type InvitationScope } from "@bday/shared";

const STYLES: Record<InvitationScope, string> = {
  single: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  couple: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  family: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
};

const ICONS: Record<InvitationScope, typeof User> = {
  single: User,
  couple: Heart,
  family: Users,
};

export function ScopeBadge({ scope }: { scope: InvitationScope }) {
  const Icon = ICONS[scope];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${STYLES[scope]}`}
    >
      <Icon size={13} />
      {SCOPE_LABELS[scope]}
    </span>
  );
}
