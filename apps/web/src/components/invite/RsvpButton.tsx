"use client";

import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import type { Guest } from "@bday/shared";
import { buildRsvpUrl } from "@/lib/google-form";

export function RsvpButton({ guest }: { guest: Guest }) {
  const url = buildRsvpUrl(guest);

  if (!url) {
    // No Google Form configured yet — keep the CTA but explain on click.
    return (
      <button
        type="button"
        onClick={() => toast.info("RSVP form is being set up. Please check back soon!")}
        className="btn-gold text-base"
      >
        <CalendarCheck size={18} />
        RSVP
      </button>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="btn-gold text-base"
    >
      <CalendarCheck size={18} />
      RSVP now
    </motion.a>
  );
}
