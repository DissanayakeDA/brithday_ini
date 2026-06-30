"use client";

import { motion } from "framer-motion";
import { Cake, Clock, PartyPopper, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { EVENT } from "@/lib/config";

/** Pick an icon per schedule item; falls back to a clock for anything new. */
const ICONS: Record<string, LucideIcon> = {
  Party: PartyPopper,
  "Cake Cutting": Cake,
  "Dinner Buffet": UtensilsCrossed,
};

export function ScheduleTimeline() {
  return (
    <div className="glass mx-auto max-w-md p-6 text-left sm:p-7">
      <p className="mb-5 text-center text-xs uppercase tracking-[0.25em] text-cream/40">
        The Evening
      </p>

      <ol className="relative space-y-6">
        {/* vertical spine linking the items */}
        <span
          aria-hidden="true"
          className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent"
        />

        {EVENT.schedule.map((item, i) => {
          const Icon = ICONS[item.label] ?? Clock;
          return (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="relative flex items-center gap-4 pl-1"
            >
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink-800 text-gold-light">
                <Icon size={16} />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="font-display text-base text-cream">{item.label}</span>
                <span className="text-sm text-cream/60">{item.time}</span>
              </span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
