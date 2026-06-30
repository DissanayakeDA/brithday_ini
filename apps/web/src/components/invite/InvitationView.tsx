"use client";

import { motion } from "framer-motion";
import { CalendarHeart, MapPin } from "lucide-react";
import type { EventSettings, Guest } from "@bday/shared";
import {
  buildInvitationMessage,
  buildMapsUrl,
  formatEventDateTime,
  resolveMapQuery,
  SCOPE_TAGLINE,
} from "@bday/shared";
import { EVENT, EVENT_TIMEZONE } from "@/lib/config";
import { Countdown } from "./Countdown";
import { RsvpButton } from "./RsvpButton";
import { MapButton } from "./MapButton";
import { MapEmbed } from "./MapEmbed";
import { ScheduleTimeline } from "./ScheduleTimeline";
import { PartyAnimations } from "./PartyAnimations";
import { PortraitAvatar } from "./PortraitAvatar";
import { BackgroundMusic } from "./BackgroundMusic";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export function InvitationView({
  guest,
  event,
}: {
  guest: Guest;
  event: EventSettings;
}) {
  const message = buildInvitationMessage(guest.name, guest.invitationScope);
  const mapQuery = resolveMapQuery(event);
  const mapsUrl = buildMapsUrl(mapQuery);
  const dateLabel = formatEventDateTime(event.dateTime, EVENT_TIMEZONE);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <PartyAnimations />
      <BackgroundMusic />

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
          className="glass relative mx-auto mt-24 max-w-xl bg-ink/60 px-6 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-20"
        >
          {/* Celebrant headshot overlapping the card's top edge — frames the
              greeting as a personal note from Grushon. */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 sm:-top-14">
            <PortraitAvatar name={EVENT.celebrant} priority />
          </div>

          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-gold-light/80">
            From {EVENT.celebrant}
          </p>
          <p className="mt-3 font-display text-xl text-cream sm:text-2xl">{message}</p>

          <div className="mt-6 flex flex-col items-center gap-3 text-cream/80 sm:flex-row sm:justify-center sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <CalendarHeart size={18} className="text-gold-light" />
              {dateLabel}
            </span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span className="inline-flex items-center gap-2">
              <MapPin size={18} className="text-gold-light" />
              {event.venue}
            </span>
          </div>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-6"
        >
          <ScheduleTimeline />
        </motion.div>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mx-auto mt-6 max-w-xl"
        >
          <MapEmbed query={mapQuery} />
        </motion.div>

        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-cream/40">
            Counting down to the celebration
          </p>
          <Countdown dateISO={event.dateTime} />
        </motion.div>

        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <RsvpButton guest={guest} />
          <MapButton url={mapsUrl} />
        </motion.div>

        <motion.p
          custom={8}
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
