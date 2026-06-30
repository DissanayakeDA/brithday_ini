import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";
import { EVENT } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center gap-2 text-gold-light">
        <PartyPopper size={20} />
        <span className="text-xs font-medium uppercase tracking-[0.3em]">
          You&apos;re Invited
        </span>
      </div>

      <h1 className="mt-5 font-display text-4xl text-gradient-gold sm:text-6xl">
        {EVENT.title}
      </h1>
      <p className="mt-3 text-cream/60">
        {EVENT.venue} &middot; {EVENT.dateLabel}
      </p>

      <p className="mt-8 max-w-md text-sm text-cream/50">
        Guests receive a personal invitation link. Hosts can add invitees and generate
        links from the manager below.
      </p>

      <Link href="/admin/invitees" className="btn-gold mt-6">
        Open Invitation Manager
        <ArrowRight size={16} />
      </Link>
    </main>
  );
}
