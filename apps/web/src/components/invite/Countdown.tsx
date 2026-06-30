"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function diff(targetMs: number) {
  const total = Math.max(0, targetMs - Date.now());
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function Countdown({ dateISO }: { dateISO: string }) {
  const target = new Date(dateISO).getTime();
  const valid = !Number.isNaN(target);
  const [time, setTime] = useState(() => diff(target));

  useEffect(() => {
    if (!valid) return;
    const id = window.setInterval(() => setTime(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target, valid]);

  if (!valid) return null;

  if (time.total === 0) {
    return (
      <p className="font-display text-2xl text-gradient-gold">The celebration has begun! 🎉</p>
    );
  }

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {units.map((unit) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass flex min-w-[68px] flex-col items-center px-3 py-3 sm:min-w-[84px] sm:px-4"
        >
          <span className="font-display text-2xl tabular-nums text-cream sm:text-4xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-cream/50 sm:text-xs">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
