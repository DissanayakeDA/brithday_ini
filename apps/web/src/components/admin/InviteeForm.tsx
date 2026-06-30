"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import type { CreateGuestInput, InvitationScope } from "@bday/shared";
import { InvitationScopeSelect } from "./InvitationScopeSelect";

type Props = {
  initial?: { name: string; invitationScope: InvitationScope };
  submitLabel?: string;
  busy?: boolean;
  onSubmit: (values: CreateGuestInput) => Promise<void> | void;
  onCancel?: () => void;
};

export function InviteeForm({
  initial,
  submitLabel = "Generate invitation link",
  busy = false,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [scope, setScope] = useState<InvitationScope>(initial?.invitationScope ?? "single");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a guest name.");
      return;
    }
    setError(null);
    await onSubmit({ name: trimmed, invitationScope: scope });
    if (!initial) {
      setName("");
      setScope("single");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guest-name" className="label">
            Guest name
          </label>
          <input
            id="guest-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Nimal Perera"
            autoComplete="off"
            aria-invalid={!!error}
            className="input"
          />
          {error && <p className="mt-1.5 text-sm text-rose-300">{error}</p>}
        </div>

        <div>
          <label htmlFor="guest-scope" className="label">
            Invitation scope
          </label>
          <InvitationScopeSelect id="guest-scope" value={scope} onChange={setScope} disabled={busy} />
        </div>
      </div>

      <div className="flex gap-2 sm:flex-col sm:items-stretch">
        <motion.button
          type="submit"
          disabled={busy}
          whileTap={{ scale: 0.97 }}
          className="btn-gold w-full sm:w-auto"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {submitLabel}
        </motion.button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost w-full sm:w-auto">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
