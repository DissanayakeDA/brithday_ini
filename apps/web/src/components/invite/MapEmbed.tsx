"use client";

import { buildMapEmbedUrl } from "@bday/shared";

/**
 * Embedded Google Map for the event location. Uses the keyless `output=embed`
 * endpoint, so no Google Maps API key/billing is required.
 */
export function MapEmbed({ query }: { query: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-glow">
      <iframe
        title={`Map showing ${query}`}
        src={buildMapEmbedUrl(query)}
        className="block h-56 w-full sm:h-72"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
