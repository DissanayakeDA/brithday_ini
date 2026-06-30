"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, X } from "lucide-react";
import type { Guest } from "@bday/shared";
import { CopyLinkButton } from "../ui/CopyLinkButton";
import { WhatsAppShareButton } from "../ui/WhatsAppShareButton";
import { ScopeBadge } from "./ScopeBadge";

type Props = {
  guest: Guest | null;
  onDismiss: () => void;
};

/** Highlights the link that was just generated for a new invitee. */
export function GeneratedLinkCard({ guest, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {guest && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="glass relative mt-5 border-gold/30 p-5 shadow-glow">
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              className="absolute right-3 top-3 text-cream/50 transition hover:text-cream"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-gold-light">
              <PartyPopper size={18} />
              <span className="text-sm font-medium">Invitation link ready</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-display text-xl text-cream">{guest.name}</span>
              <ScopeBadge scope={guest.invitationScope} />
            </div>

            <div className="mt-3 break-all rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-gold-light">
              {guest.formUrl}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <CopyLinkButton link={guest.formUrl} variant="solid" label="Copy link" />
              <WhatsAppShareButton name={guest.name} link={guest.formUrl} variant="solid" />
              <a
                href={guest.formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Preview invitation
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
