"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import type { CalendarEvent } from "@bday/shared";
import { buildGoogleCalendarUrl, buildIcsContent } from "@bday/shared";

/**
 * "Add to Calendar" CTA. Opens a small menu so the guest can choose Google
 * Calendar (a prefilled event link) or Apple / other apps (a downloaded .ics
 * that iPhone, Mac, and Outlook open in their default calendar).
 */
export function AddToCalendarButton({ event }: { event: CalendarEvent }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const googleUrl = buildGoogleCalendarUrl(event);

  // Close the menu on an outside tap or the Escape key.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function downloadIcs() {
    const blob = new Blob([buildIcsContent(event)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grashan-birthday.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.97 }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-ghost"
      >
        <CalendarPlus size={16} />
        Add to Calendar
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="glass absolute left-1/2 top-full z-20 mt-2 w-60 -translate-x-1/2 overflow-hidden p-1.5 text-left shadow-glow"
          >
            <a
              role="menuitem"
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/90 transition hover:bg-white/[0.07]"
            >
              <GoogleGlyph />
              Google Calendar
            </a>
            <button
              role="menuitem"
              type="button"
              onClick={downloadIcs}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/90 transition hover:bg-white/[0.07]"
            >
              <AppleGlyph />
              Apple / Other (.ics)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Multi-colour Google "G" mark. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" width={18} height={18} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

/** Apple logo, tinted to the current text colour. */
function AppleGlyph() {
  return (
    <svg
      viewBox="0 0 384 512"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}
