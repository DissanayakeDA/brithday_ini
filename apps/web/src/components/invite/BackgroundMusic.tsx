"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const SRC = "/bg-music.mp3";

/**
 * Looping background music for the invitation with a play/pause control.
 *
 * Browsers block autoplay with sound, so playback begins on the visitor's first
 * interaction (or when they tap the button). The floating button always lets
 * them pause or resume.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = "auto";
    audioRef.current = audio;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const start = () => audio.play().catch(() => {});
    // Try immediately (usually blocked), then fall back to the first gesture.
    start();
    const onGesture = () => {
      if (audio.paused) start();
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Keep the global "first gesture" starter from also firing on this tap.
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
      className="group fixed bottom-5 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-ink/70 text-gold-light shadow-luxe backdrop-blur-md transition hover:bg-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:bottom-6 sm:right-6"
    >
      {/* gentle pulse ring while playing */}
      {playing && !reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-gold/40"
          animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {playing ? (
        <Pause size={18} fill="currentColor" />
      ) : (
        <Play size={18} fill="currentColor" className="translate-x-[1px]" />
      )}
    </button>
  );
}
