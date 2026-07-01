"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Guest } from "@bday/shared";
import { CopyLinkButton } from "../ui/CopyLinkButton";
import { WhatsAppShareButton } from "../ui/WhatsAppShareButton";
import { ScopeBadge } from "./ScopeBadge";

type Props = {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
};

/** Desktop / tablet view: a clean data table. */
export function InviteeTable({ guests, onEdit, onDelete }: Props) {
  return (
    <div className="glass hidden overflow-hidden md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-cream/50">
          <tr>
            <th className="px-5 py-4 font-medium">Guest</th>
            <th className="px-5 py-4 font-medium">Scope</th>
            <th className="px-5 py-4 font-medium">Invitation link</th>
            <th className="px-5 py-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {guests.map((guest) => (
              <motion.tr
                key={guest.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -12 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4 font-display text-base text-cream">{guest.name}</td>
                <td className="px-5 py-4">
                  <ScopeBadge scope={guest.invitationScope} />
                </td>
                <td className="max-w-[22rem] px-5 py-4">
                  <a
                    href={guest.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 truncate font-mono text-xs text-gold-light hover:underline"
                    title={guest.formUrl}
                  >
                    <span className="truncate">{guest.formUrl}</span>
                    <ExternalLink size={13} className="shrink-0" />
                  </a>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <CopyLinkButton
                      link={guest.formUrl}
                      name={guest.name}
                      variant="icon"
                      label="Copy invitation message"
                    />
                    <WhatsAppShareButton
                      name={guest.name}
                      link={guest.formUrl}
                      variant="icon"
                    />
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
                      className="btn !px-2.5 border border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
