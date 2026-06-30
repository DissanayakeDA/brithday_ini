"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { EVENT } from "@/lib/config";

export function MapButton() {
  return (
    <motion.a
      href={EVENT.mapsUrl}
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
