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

// Gentle settle for lifts; a weighted curve for anything that hinges open.
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
// The flap flings open with real mass — low damping gives it a soft overshoot
// and settle (follow-through), the way a stiff paper lid actually swings.
const SPRING_FLAP = {
  type: "spring" as const,
  stiffness: 120,
  damping: 13,
  mass: 0.9,
};
const SPRING_CARD = {
  type: "spring" as const,
  stiffness: 90,
  damping: 17,
  mass: 1,
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Fine paper grain — an inline feTurbulence tile laid over every paper surface
// at low opacity so the envelope reads as fibrous card stock, not flat vector.
const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Wax shards that fly out when the seal breaks. Fixed angles (no Math.random)
// so the server and client render identically — no hydration mismatch.
const SPARKS = [0, 1, 2, 3, 4, 5, 6, 7];
const sparkVariants: Variants = {
  hidden: { x: 0, y: 0, opacity: 0, scale: 0.4 },
  burst: (i: number) => {
    const angle = (Math.PI * 2 * i) / SPARKS.length - Math.PI / 2;
    const radius = 44 + (i % 3) * 12;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.2],
      rotate: (i % 2 ? 1 : -1) * 120,
      transition: { duration: 0.6, ease: "easeOut" },
    };
  },
};

/**
 * The welcome gate: a sealed invitation the guest opens by tapping the wax
 * seal. The seal presses, cracks (shards scatter) with a jolt through the
 * paper; the lid flings open in 3D revealing its lighter inner face; warm
 * light spills from the pocket, and the card rises out — then the parent
 * swaps in the full invitation.
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
  // Once the lid swings past vertical it drops behind the card, so the card
  // reads as sliding out in front of the standing-open flap.
  const [flapBehind, setFlapBehind] = useState(false);

  const shell = useAnimationControls();
  const flap = useAnimationControls();
  const seal = useAnimationControls();
  const sparks = useAnimationControls();
  const glow = useAnimationControls();
  const card = useAnimationControls();

  // Slow breathing glow on the seal until the guest opens it.
  useEffect(() => {
    if (reduce) return;
    seal.start({
      scale: [1, 1.05, 1],
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

    // 1) the seal presses in (anticipation), then cracks apart as its shards
    //    scatter and a short jolt runs through the whole envelope.
    sparks.start("burst");
    shell.start({
      x: [0, -5, 6, -4, 3, -1, 0],
      transition: { duration: 0.42, ease: "easeOut" },
    });
    await seal.start({
      scale: [1, 0.84, 1.3, 0.08],
      opacity: [1, 1, 1, 0],
      rotate: [0, -5, 10, 20],
      y: [0, -1, 5, 14],
      transition: { duration: 0.5, ease: "easeIn", times: [0, 0.28, 0.55, 1] },
    });

    // 2) warm light wells up as the lid flings open, dropping behind the card
    //    once it swings past vertical.
    glow.start({
      opacity: 1,
      scale: 1.2,
      transition: { duration: 1, ease: "easeOut" },
    });
    flap.start({ rotateX: -164, transition: SPRING_FLAP });
    await wait(300);
    setFlapBehind(true);
    await wait(140);

    // 3) the invitation card rises out of the envelope with a small settle
    await card.start({
      y: "-92%",
      scale: 1.05,
      rotate: [0, -1.4, 0],
      boxShadow: "0 44px 74px -24px rgba(0,0,0,0.78)",
      transition: SPRING_CARD,
    });

    // 4) hold a beat on the open invitation, then hand off
    await wait(320);
    onOpen();
  }

  return (
    <motion.main
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-16"
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
        className="relative z-10 block w-[min(90vw,440px)] cursor-pointer rounded-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
        initial={{ opacity: 0, y: 44, scale: 0.96 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.8, ease: EASE_OUT },
        }}
        whileHover={reduce || isOpening ? undefined : { y: -6, scale: 1.02 }}
        whileTap={reduce || isOpening ? undefined : { scale: 0.99 }}
      >
        <motion.div className="relative aspect-[3/2] w-full" animate={shell}>
          {/* soft contact shadow grounding the envelope on the page */}
          <div
            className="pointer-events-none absolute inset-x-[12%] bottom-[-6%] h-[14%] rounded-[50%] bg-black/60 blur-2xl"
            aria-hidden="true"
          />

          {/* envelope back + interior (revealed as the lid opens) — matte-black
              card stock with a thin gold edge that frames the whole rectangle */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[14px] border border-gold/35 bg-gradient-to-b from-[#141315] to-[#050406] shadow-luxe">
            {/* inner lip shadow at the mouth, so the card reads as tucked deep */}
            <div className="absolute inset-x-0 top-[42%] h-16 bg-gradient-to-b from-black/65 to-transparent" />
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
              style={{
                background:
                  "radial-gradient(120% 92% at 50% 0%, rgba(231,205,134,0.5), rgba(200,162,76,0.14) 46%, transparent 74%)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={glow}
            />
            <Grain className="opacity-[0.05]" />
          </div>

          {/* the invitation card, tucked inside the envelope */}
          <motion.div
            className="absolute inset-x-[7%] bottom-[5%] top-[45%] z-20 overflow-hidden rounded-[10px] border border-gold/45 bg-gradient-to-b from-[#17161a] to-[#08070a]"
            style={{ boxShadow: "0 18px 36px -28px rgba(0,0,0,0.6)" }}
            initial={{ y: 0, scale: 1 }}
            animate={card}
          >
            <div className="pointer-events-none absolute inset-2.5 rounded-lg border border-gold/20" />
            <Grain className="opacity-[0.04]" />
            <div className="flex h-full flex-col items-center gap-1.5 px-5 pt-[13%] text-center">
              <p className="text-[0.6rem] uppercase tracking-[0.42em] text-gold-light">
                You&apos;re Invited
              </p>
              <p className="font-display text-4xl leading-none text-gradient-gold">
                Grashon&apos;s
              </p>
              <p className="font-display text-base tracking-wide text-cream/90">
                Birthday Celebration
              </p>
              <span className="my-1 h-px w-10 bg-gold/50" />
              <p className="text-[0.6rem] uppercase tracking-[0.32em] text-cream/40">
                A night to remember
              </p>
            </div>
          </motion.div>

          {/* envelope front pocket — the seamed paper that keeps the card tucked.
              Its flaps meet at the seal in an upward fan, the way a real
              envelope's bottom + side flaps fold in. */}
          <div className="absolute inset-x-0 bottom-0 z-30 h-[58%] overflow-hidden rounded-b-[14px]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="flapFront" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#161517" />
                  <stop offset="1" stopColor="#090809" />
                </linearGradient>
                <linearGradient id="flapBottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1c1b1e" />
                  <stop offset="1" stopColor="#100f11" />
                </linearGradient>
              </defs>
              {/* base (the side flaps folded in) */}
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill="url(#flapFront)"
              />
              {/* the two side-flap fold seams running up to the seal */}
              <line
                x1="0"
                y1="0"
                x2="50"
                y2="2"
                stroke="rgba(0,0,0,0.45)"
                strokeWidth="0.8"
              />
              <line
                x1="100"
                y1="0"
                x2="50"
                y2="2"
                stroke="rgba(0,0,0,0.45)"
                strokeWidth="0.8"
              />
              {/* bottom flap: a broad triangle rising to the seal, sitting on top
                  of the side flaps so its edges catch the light as fold ridges */}
              <polygon points="50,2 100,100 0,100" fill="url(#flapBottom)" />
              <line
                x1="50"
                y1="2"
                x2="0"
                y2="100"
                stroke="rgba(231,205,134,0.38)"
                strokeWidth="0.7"
              />
              <line
                x1="50"
                y1="2"
                x2="100"
                y2="100"
                stroke="rgba(231,205,134,0.38)"
                strokeWidth="0.7"
              />
              <line
                x1="50"
                y1="3"
                x2="0"
                y2="100"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="0.35"
                transform="translate(0.7 0)"
              />
            </svg>

            {/* crisp lit front edge at the mouth of the pocket */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
            <Grain className="opacity-[0.06]" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 text-center">
              <p className="font-display text-2xl text-cream sm:text-[1.7rem]">
                Dear {name}
              </p>
              <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.28em] text-cream/45">
                {SCOPE_TAGLINE[scope]}
              </p>
            </div>
          </div>

          {/* the lid that folds open — two paper faces, so its lighter gummed
              underside shows once it swings back */}
          <div
            className={`absolute inset-x-0 top-0 h-1/2 ${flapBehind ? "z-[5]" : "z-40"}`}
            style={{ perspective: 1500 }}
          >
            <motion.div
              className="relative h-full w-full"
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
              initial={{ rotateX: 0 }}
              animate={flap}
            >
              {/* outer face (what you see while sealed) */}
              <div
                className="absolute inset-0 rounded-t-[14px]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background:
                    "linear-gradient(180deg, rgba(231,205,134,0.22), #121114 58%, #060507 100%)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.6))",
                }}
              >
                {/* fold crease along the hinge + centre spine down to the tip */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-light/40 to-transparent" />
                <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-gold/35 to-transparent" />
                <Grain className="opacity-[0.06]" />
              </div>
              {/* inner face (the flap's underside, seen when open) */}
              <div
                className="absolute inset-0 rounded-t-[14px]"
                style={{
                  clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                  background:
                    "linear-gradient(180deg, #060507, #17161a 80%, #201e24 100%)",
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                <Grain className="opacity-[0.05]" />
              </div>
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
              className="grid h-16 w-16 place-items-center"
              style={{
                // a poured-wax blob rather than a perfect disc
                borderRadius: "46% 54% 52% 48% / 50% 47% 53% 50%",
                background:
                  "radial-gradient(circle at 36% 30%, #edd695, #c19a48 52%, #7e601f 100%)",
                boxShadow:
                  "0 4px 14px -2px rgba(0,0,0,0.55), 0 0 26px -4px rgba(200,162,76,0.65), inset 0 3px 7px rgba(255,255,255,0.4), inset 0 -5px 9px rgba(0,0,0,0.4)",
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={seal}
            >
              {/* specular glint + pressed rim */}
              <span className="pointer-events-none absolute left-[26%] top-[22%] h-2.5 w-3 rounded-full bg-white/55 blur-[2px]" />
              <span
                className="pointer-events-none absolute inset-[5px] border border-ink/25"
                style={{ borderRadius: "inherit" }}
              />
              <span
                className="font-display text-xl font-bold text-ink/80"
                style={{ textShadow: "0 1px 0 rgba(255,255,255,0.45)" }}
              >
                40
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>

      <motion.p
        className="relative z-10 mt-8 text-xs uppercase tracking-[0.3em] text-cream/40"
        initial={{ opacity: 0 }}
        animate={
          reduce
            ? { opacity: 1 }
            : {
                opacity: [0.25, 0.7, 0.25],
                transition: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }
        }
        aria-hidden="true"
      >
        Tap to open
      </motion.p>
    </motion.main>
  );
}

/** Fibrous paper grain overlaid on a surface via an inline feTurbulence tile. */
function Grain({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 mix-blend-overlay ${className}`}
      style={{ backgroundImage: PAPER_GRAIN, backgroundSize: "140px 140px" }}
      aria-hidden="true"
    />
  );
}

/** Calm ambient backdrop — two slow gold orbs on black, no busy confetti. */
function Ambient() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-gold/15 blur-3xl animate-float motion-reduce:animate-none" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-gold-dark/[0.16] blur-3xl animate-float [animation-delay:1.8s] motion-reduce:animate-none" />
    </div>
  );
}
