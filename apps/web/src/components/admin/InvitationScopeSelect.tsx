"use client";

import { ChevronDown } from "lucide-react";
import { INVITATION_SCOPES, SCOPE_LABELS, type InvitationScope } from "@bday/shared";

type Props = {
  id?: string;
  value: InvitationScope;
  onChange: (scope: InvitationScope) => void;
  disabled?: boolean;
};

export function InvitationScopeSelect({ id, value, onChange, disabled }: Props) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as InvitationScope)}
        className="input appearance-none pr-10"
      >
        {INVITATION_SCOPES.map((scope) => (
          <option key={scope} value={scope} className="bg-ink-700 text-cream">
            {SCOPE_LABELS[scope]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream/50"
      />
    </div>
  );
}
