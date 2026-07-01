"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { buildInviteMessage } from "@/lib/whatsapp";

type Props = {
  link: string;
  /**
   * Guest's name. When provided, the button copies the full pre-written
   * invitation message (matching the WhatsApp share) instead of the bare link.
   */
  name?: string;
  label?: string;
  /** "solid" = gold button, "ghost" = outlined, "icon" = compact icon-only. */
  variant?: "solid" | "ghost" | "icon";
  className?: string;
};

export function CopyLinkButton({
  link,
  name,
  label = "Copy link",
  variant = "ghost",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = name ? buildInviteMessage(name, link) : link;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(
        name ? "Invitation message copied to clipboard" : "Invitation link copied to clipboard",
      );
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy automatically — please copy the link manually.");
    }
  }

  const base =
    variant === "solid" ? "btn-gold" : variant === "icon" ? "btn-ghost !px-2.5" : "btn-ghost";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={copy}
      aria-label={label}
      className={`${base} ${className}`}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {variant !== "icon" && <span>{copied ? "Copied" : label}</span>}
    </motion.button>
  );
}
