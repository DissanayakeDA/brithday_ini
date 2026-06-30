"use client";

import { motion } from "framer-motion";
import { CalendarHeart, MapPin } from "lucide-react";
import type { Guest } from "@bday/shared";
import { buildInvitationMessage, SCOPE_TAGLINE } from "@bday/shared";
import { EVENT } from "@/lib/config";
import { Countdown } from "./Countdown";
import { RsvpButton } from "./RsvpButton";
import { MapButton } from "./MapButton";
import { PartyAnimations } from "./PartyAnimations";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export function InvitationView({ guest }: { guest: Guest }) {
  const message = buildInvitationMessage(guest.name, guest.invitationScope);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <PartyAnimations />

      <section className="relative z-10 w-full max-w-2xl text-center">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-xs uppercase tracking-[0.35em] text-gold-light"
        >
          You&apos;re Invited
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-4 font-display text-4xl leading-tight text-gradient-gold sm:text-6xl"
        >
          {EVENT.title}
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-3 text-sm uppercase tracking-[0.2em] text-cream/50"
        >
          {SCOPE_TAGLINE[guest.invitationScope]}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="glass mx-auto mt-8 max-w-xl p-6 sm:p-8"
        >
          <p className="font-display text-xl text-cream sm:text-2xl">{message}</p>

          <div className="mt-6 flex flex-col items-center gap-3 text-cream/80 sm:flex-row sm:justify-center sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <CalendarHeart size={18} className="text-gold-light" />
              {EVENT.dateLabel}
            </span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span className="inline-flex items-center gap-2">
              <MapPin size={18} className="text-gold-light" />
              {EVENT.venue}
            </span>
          </div>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-cream/40">
            Counting down to the celebration
          </p>
          <Countdown dateISO={EVENT.dateISO} />
        </motion.div>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <RsvpButton guest={guest} />
          <MapButton />
        </motion.div>

        <motion.p
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 text-xs text-cream/40"
        >
          We can&apos;t wait to celebrate with you.
        </motion.p>
      </section>
    </main>
  );
}
