"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { Guest } from "@bday/shared";
import { CopyLinkButton } from "../ui/CopyLinkButton";
import { WhatsAppShareButton } from "../ui/WhatsAppShareButton";
import { ScopeBadge } from "./ScopeBadge";

type Props = {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
};

/** Mobile view: stacked cards (hidden on md+ where the table is shown). */
export function InviteeList({ guests, onEdit, onDelete }: Props) {
  return (
    <div className="grid gap-3 md:hidden">
      <AnimatePresence initial={false}>
        {guests.map((guest) => (
          <motion.div
            key={guest.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="glass p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-cream">{guest.name}</p>
                <div className="mt-1.5">
                  <ScopeBadge scope={guest.invitationScope} />
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onEdit(guest)}
                  aria-label={`Edit ${guest.name}`}
                  className="btn-ghost !px-2.5"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(guest)}
                  aria-label={`Delete ${guest.name}`}
                  className="btn !px-2.5 border border-rose-400/30 bg-rose-500/10 text-rose-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <a
              href={guest.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block break-all rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-gold-light"
            >
              {guest.formUrl}
            </a>

            <div className="mt-3 flex flex-wrap gap-2">
              <CopyLinkButton
                link={guest.formUrl}
                name={guest.name}
                label="Copy"
                className="flex-1"
              />
              <WhatsAppShareButton
                name={guest.name}
                link={guest.formUrl}
                label="WhatsApp"
                className="flex-1"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
