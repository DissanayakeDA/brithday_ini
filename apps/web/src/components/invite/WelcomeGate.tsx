"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { InvitationScope } from "@bday/shared";
import { SCOPE_TAGLINE } from "@bday/shared";

// Gentle settle for the lift; a weighted curve for the lid flinging open.
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_LID: [number, number, number, number] = [0.4, 0.1, 0.2, 1];

// Wax shards that fly out when the seal breaks. Fixed angles (no Math.random)
// so the server and client render identically — no hydration mismatch.
const SPARKS = [0, 1, 2, 3, 4, 5];
const sparkVariants: Variants = {
  hidden: { x: 0, y: 0, opacity: 0, scale: 0.4 },
  burst: (i: number) => {
    const angle = (Math.PI * 2 * i) / SPARKS.length - Math.PI / 2;
    const radius = 48;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      opacity: [0, 1, 0],
      scale: [0.4, 1, 0.2],
      transition: { duration: 0.55, ease: "easeOut" },
    };
  },
};

/**
 * The welcome gate: a sealed invitation the guest opens by tapping the wax
 * seal. The seal cracks (shards fly out), the flap folds open in 3D, warm
 * light spills out, and the invitation card rises out of the envelope —
 * then the parent swaps in the full invitation.
 */
export function WelcomeGate({
  name,
  scope,
  onOpen,
}: {
  name: string;
  scope: InvitationScope;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);
  // Once the lid is open it drops behind the card, so the card reads as
  // sliding out in front of the lifted flap.
  const [flapBehind, setFlapBehind] = useState(false);

  const flap = useAnimationControls();
  const seal = useAnimationControls();
  const sparks = useAnimationControls();
  const glow = useAnimationControls();
  const card = useAnimationControls();

  // Slow breathing glow on the seal until the guest opens it.
  useEffect(() => {
    if (reduce) return;
    seal.start({
      scale: [1, 1.06, 1],
      transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
    });
  }, [reduce, seal]);

  async function handleOpen() {
    if (isOpening) return;
    setIsOpening(true);

    if (reduce) {
      onOpen();
      return;
    }

    // 1) the wax seal cracks and its shards scatter
    sparks.start("burst");
    await seal.start({
      scale: [1, 1.22, 0.1],
      opacity: [1, 1, 0],
      rotate: 14,
      y: 10,
      transition: { duration: 0.45, ease: "easeIn" },
    });

    // 2) warm light wells up as the lid flings open and settles
    glow.start({ opacity: 1, scale: 1.18, transition: { duration: 1, ease: "easeOut" } });
    await flap.start({
      rotateX: [0, -178, -166],
      transition: { duration: 0.9, ease: EASE_LID },
    });
    setFlapBehind(true);

    // 3) the invitation card rises out of the envelope
    await card.start({
      y: "-90%",
      scale: 1.04,
      boxShadow: "0 42px 70px -24px rgba(0,0,0,0.75)",
      transition: { duration: 0.95, ease: EASE_OUT },
    });

    // 4) hold a beat on the open invitation, then hand off
    await new Promise((resolve) => setTimeout(resolve, 350));
    onOpen();
  }

  return (
    <motion.main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={
        reduce
          ? { opacity: 0, transition: { duration: 0.2 } }
          : {
              opacity: 0,
              scale: 1.06,
              filter: "blur(10px)",
              transition: { duration: 0.5, ease: "easeIn" },
            }
      }
    >
      <Ambient />

      <motion.button
        type="button"
        onClick={handleOpen}
        disabled={isOpening}
        aria-label={`Open your invitation, ${name}`}
        className="relative z-10 block w-[min(86vw,400px)] cursor-pointer rounded-[28px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
        initial={{ opacity: 0, y: 44, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE_OUT } }}
        whileHover={reduce || isOpening ? undefined : { y: -6, scale: 1.02 }}
        whileTap={reduce || isOpening ? undefined : { scale: 0.99 }}
      >
        {/* stage — not clipped, so the card and lid can rise above the envelope */}
        <div className="relative aspect-[4/5] w-full">
          {/* envelope back + interior */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px] border border-gold/30 bg-gradient-to-b from-ink-800 to-ink shadow-luxe">
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
              style={{
                background:
                  "radial-gradient(120% 90% at 50% 0%, rgba(231,205,134,0.55), rgba(224,115,154,0.18) 45%, transparent 72%)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={glow}
            />
          </div>

          {/* the invitation card, tucked inside the envelope */}
          <motion.div
            className="absolute inset-x-[7%] bottom-[5%] top-[46%] z-20 overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-b from-ink-700 to-ink-800"
            style={{ boxShadow: "0 18px 36px -28px rgba(0,0,0,0.6)" }}
            initial={{ y: 0, scale: 1 }}
            animate={card}
          >
            <div className="pointer-events-none absolute inset-2.5 rounded-xl border border-gold/15" />
            <div className="flex h-full flex-col items-center gap-1.5 px-5 pt-[14%] text-center">
              <p className="text-[0.6rem] uppercase tracking-[0.42em] text-gold-light">
                You&apos;re Invited
              </p>
              <p className="font-display text-4xl leading-none text-gradient-gold">Grushon&apos;s</p>
              <p className="font-display text-base tracking-wide text-cream/90">
                Birthday Celebration
              </p>
              <span className="my-1 h-px w-10 bg-gold/50" />
              <p className="text-[0.6rem] uppercase tracking-[0.32em] text-cream/40">
                A night to remember
              </p>
            </div>
          </motion.div>

          {/* envelope front pocket — keeps the card's lower half tucked in */}
          <div className="absolute inset-x-0 bottom-0 z-30 h-[56%] overflow-hidden rounded-b-[28px] bg-gradient-to-b from-ink-700 to-ink-800">
            {/* crisp front edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
            {/* envelope front seams */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line x1="0" y1="0" x2="50" y2="100" stroke="rgba(231,205,134,0.16)" strokeWidth="0.5" />
              <line x1="100" y1="0" x2="50" y2="100" stroke="rgba(231,205,134,0.16)" strokeWidth="0.5" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 text-center">
              <p className="font-display text-2xl text-cream sm:text-[1.7rem]">Dear {name}</p>
              <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.28em] text-cream/45">
                {SCOPE_TAGLINE[scope]}
              </p>
            </div>
          </div>

          {/* the lid that folds open */}
          <div
            className={`absolute inset-x-0 top-0 h-1/2 ${flapBehind ? "z-[5]" : "z-40"}`}
            style={{ perspective: 1400 }}
          >
            <motion.div
              className="h-full w-full rounded-t-[28px]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background:
                  "linear-gradient(180deg, rgba(231,205,134,0.24), rgba(28,26,43,0.97) 80%)",
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))",
              }}
              initial={{ rotateX: 0 }}
              animate={flap}
            >
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-gold/30 to-transparent" />
            </motion.div>
          </div>

          {/* wax shards (revealed only as the seal breaks) */}
          <div
            className="pointer-events-none absolute left-1/2 top-[calc(50%-2px)] z-[45] h-0 w-0"
            aria-hidden="true"
          >
            {SPARKS.map((i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-gold-light"
                custom={i}
                variants={sparkVariants}
                initial="hidden"
                animate={sparks}
              />
            ))}
          </div>

          {/* wax seal, centred on the lid's tip. The centering lives on this
              static wrapper so Framer Motion's animated transform (scale on the
              breathing loop, rotate/y on open) can't clobber the translate. */}
          <div className="absolute left-1/2 top-[calc(50%-2px)] z-50 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="grid h-16 w-16 place-items-center rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #e7cd86, #b58a3c 55%, #7e601f 100%)",
                boxShadow:
                  "0 0 26px -4px rgba(200,162,76,0.7), inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -4px 8px rgba(0,0,0,0.35)",
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={seal}
            >
              <span className="pointer-events-none absolute inset-[5px] rounded-full border border-ink/25" />
              <span
                className="font-display text-xl font-bold text-ink/80"
                style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}
              >
                40
              </span>
            </motion.div>
          </div>
        </div>
      </motion.button>

      <motion.p
        className="relative z-10 mt-8 text-xs uppercase tracking-[0.3em] text-cream/40"
        initial={{ opacity: 0 }}
        animate={
          reduce
            ? { opacity: 1 }
            : {
                opacity: [0.25, 0.7, 0.25],
                transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1 },
              }
        }
        aria-hidden="true"
      >
        Tap to open
      </motion.p>
    </motion.main>
  );
}

/** Calm ambient backdrop — two slow gold/rose orbs, no busy confetti. */
function Ambient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-gold/15 blur-3xl animate-float motion-reduce:animate-none" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-rose/[0.12] blur-3xl animate-float [animation-delay:1.8s] motion-reduce:animate-none" />
    </div>
  );
}
