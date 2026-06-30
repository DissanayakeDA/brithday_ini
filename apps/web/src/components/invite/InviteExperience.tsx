"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { EventSettings, Guest } from "@bday/shared";
import { WelcomeGate } from "./WelcomeGate";
import { InvitationView } from "./InvitationView";

/**
 * Wraps the invitation in a "sealed envelope" welcome gate. The guest first
 * sees their name on a wax-sealed card and opens it; only then do the party
 * details appear. Purely a client-side reveal — the full invitation is still
 * rendered (and reachable for screen readers) once opened.
 */
export function InviteExperience({
  guest,
  event,
}: {
  guest: Guest;
  event: EventSettings;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {opened ? (
        <InvitationView key="invitation" guest={guest} event={event} />
      ) : (
        <WelcomeGate
          key="welcome"
          name={guest.name}
          scope={guest.invitationScope}
          onOpen={() => setOpened(true)}
        />
      )}
    </AnimatePresence>
  );
}
