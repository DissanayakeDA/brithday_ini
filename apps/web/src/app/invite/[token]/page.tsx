import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildInvitationMessage, EVENT_DETAILS, EVENT_NAME } from "@bday/shared";
import { ApiError, guestsApi } from "@/lib/api";
import { InviteExperience } from "@/components/invite/InviteExperience";

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
    title: `${guest.name} — ${EVENT_NAME}`,
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
  return <InviteExperience guest={guest} event={EVENT_DETAILS} />;
}
