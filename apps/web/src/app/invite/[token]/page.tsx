import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildInvitationMessage } from "@bday/shared";
import { ApiError, guestsApi } from "@/lib/api";
import { InvitationView } from "@/components/invite/InvitationView";

// Always render on demand — guest data is dynamic and must not be cached.
export const dynamic = "force-dynamic";

async function getGuest(token: string) {
  try {
    return await guestsApi.getByToken(token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err; // genuine server/network error -> let Next show the error page
  }
}

export async function generateMetadata({
  params,
}: {
  params: { token: string };
}): Promise<Metadata> {
  const guest = await getGuest(params.token);
  if (!guest) return { title: "Invitation not found" };
  return {
    title: `${guest.name} — 40th Birthday Celebration`,
    description: buildInvitationMessage(guest.name, guest.invitationScope),
  };
}

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const guest = await getGuest(params.token);
  if (!guest) notFound();
  return <InvitationView guest={guest} />;
}
