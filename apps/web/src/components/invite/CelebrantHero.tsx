"use client";

import { Component, type ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// The 3D stage is heavy (three.js + a 13 MB model), so it's split into its own
// client-only chunk and never rendered on the server.
const CelebrantStage = dynamic(() => import("./CelebrantStage"), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

/**
 * A framed 3D showpiece of the celebrant for the top of the invitation. It
 * degrades gracefully: a themed skeleton while the chunk + model load, and a
 * static poster fallback if WebGL is unavailable or the scene errors — so the
 * invite is never broken by the 3D layer.
 */
export function CelebrantHero({ name }: { name: string }) {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* warm glow pooling behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-6 -z-10 h-[70%] rounded-[50%] bg-gold/20 blur-3xl"
      />

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-gold/25 bg-gradient-to-b from-ink-700/80 to-ink shadow-luxe">
        {/* subtle inner frame line, echoing the invitation card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 z-20 rounded-[20px] border border-gold/15"
        />

        <StageErrorBoundary fallback={<StagePoster name={name} />}>
          <div className="absolute inset-0 cursor-grab active:cursor-grabbing [touch-action:none]">
            <CelebrantStage onReady={() => setReady(true)} />
          </div>
        </StageErrorBoundary>

        {/* skeleton overlay fades out once the model reports ready */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: ready ? 0 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <StageSkeleton />
        </motion.div>

        {/* drag hint, revealed once the figure is in */}
        <motion.p
          className="pointer-events-none absolute inset-x-0 bottom-3 z-20 text-center text-[0.62rem] uppercase tracking-[0.3em] text-cream/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.6, delay: ready ? 0.3 : 0 }}
        >
          Drag to spin
        </motion.p>
      </div>
    </div>
  );
}

/** Themed loading state — a soft shimmering plinth glow while the scene loads. */
function StageSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-b from-ink-700/60 to-ink">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-gold/20 border-t-gold/70 motion-reduce:animate-none" />
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-cream/40">
          Preparing the reveal
        </p>
      </div>
    </div>
  );
}

/** Static fallback if WebGL can't run — keeps the frame elegant, not empty. */
function StagePoster({ name }: { name: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-b from-ink-700 to-ink px-6 text-center">
      <div>
        <p className="font-display text-3xl text-gradient-gold">{name}</p>
        <p className="mt-2 text-[0.62rem] uppercase tracking-[0.3em] text-cream/45">
          Guest of honour
        </p>
      </div>
    </div>
  );
}

/** Isolates any three.js/WebGL error so it never takes down the invite page. */
class StageErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
