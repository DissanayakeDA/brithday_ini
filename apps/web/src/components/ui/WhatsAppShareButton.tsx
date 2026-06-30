"use client";

import { motion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Props = {
  name: string;
  link: string;
  label?: string;
  variant?: "solid" | "ghost" | "icon";
  className?: string;
};

export function WhatsAppShareButton({
  name,
  link,
  label = "Share on WhatsApp",
  variant = "ghost",
  className = "",
}: Props) {
  const href = buildWhatsAppUrl(name, link);

  const base =
    variant === "solid"
      ? "btn bg-[#25D366] text-ink hover:brightness-105"
      : variant === "icon"
        ? "btn-ghost !px-2.5"
        : "btn-ghost";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      className={`${base} ${className}`}
    >
      <WhatsAppIcon className="text-[1.05rem]" />
      {variant !== "icon" && <span>{label}</span>}
    </motion.a>
  );
}
