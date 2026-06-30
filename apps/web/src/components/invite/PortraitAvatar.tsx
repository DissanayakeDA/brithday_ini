"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const SPRING = { stiffness: 170, damping: 16, mass: 0.5 } as const;

/**
 * Compact circular portrait of the celebrant. A gold-ringed headshot that tilts
 * gently toward the pointer with a sheen sweep — a warm, personal accent rather
 * than a hero. Renders a still ring under prefers-reduced-motion.
 */
export function PortraitAvatar({
  name,
  priority = false,
}: {
  name: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [10, -10]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), SPRING);

  // Sheen is invisible at rest and only fades in while the pointer is over the
  // avatar, so there's no bright spot washing the face by default.
  const sheen = useSpring(0, { stiffness: 200, damping: 28 });
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(55% 55% at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 60%)`;

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
    sheen.set(0);
  }

  const ring = (
    <div className="rounded-full bg-gold-gradient p-[3px] shadow-[0_12px_30px_-14px_rgba(0,0,0,0.75)]">
      <div className="relative overflow-hidden rounded-full bg-ink p-1">
        <Image
          src="/person-avatar.jpg"
          alt={name}
          width={224}
          height={224}
          priority={priority}
          draggable={false}
          className="h-24 w-24 rounded-full object-cover object-center sm:h-28 sm:w-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1 rounded-full ring-1 ring-inset ring-white/15"
        />
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ background: glare, opacity: sheen }}
            className="pointer-events-none absolute inset-1 rounded-full mix-blend-screen"
          />
        )}
      </div>
    </div>
  );

  if (reduce) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-2 -z-10 rounded-full bg-gold/15 blur-xl"
        />
        {ring}
      </div>
    );
  }

  return (
    <div className="[perspective:700px]">
      <motion.div
        ref={ref}
        onPointerEnter={() => sheen.set(1)}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          aria-hidden
          style={{ transform: "translateZ(-40px)" }}
          className="absolute -inset-2 rounded-full bg-gold/15 blur-xl"
        />
        {ring}
      </motion.div>
    </div>
  );
}
