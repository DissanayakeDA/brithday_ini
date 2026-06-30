"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function MapButton({ url }: { url: string }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.97 }}
      className="btn-ghost"
    >
      <MapPin size={16} />
      Open in Maps
    </motion.a>
  );
}
