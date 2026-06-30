"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#e7cd86", "#c8a24c", "#e0739a", "#f6f1e7", "#9c7a2f"];

/**
 * Decorative, non-interactive background: drifting confetti specks and a few
 * floating glowing orbs. Pointer-events disabled so it never blocks the UI.
 */
export function PartyAnimations() {
  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 7,
        size: 5 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        rounded: Math.random() > 0.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* glowing orbs */}
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl animate-float" />
      <div className="absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-rose/15 blur-3xl animate-float [animation-delay:1.5s]" />

      {/* confetti */}
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="absolute top-[-5%]"
          style={{
            left: `${c.left}%`,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: c.rounded ? "9999px" : "2px",
          }}
          initial={{ y: "-5vh", opacity: 0, rotate: 0 }}
          animate={{ y: "105vh", opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
