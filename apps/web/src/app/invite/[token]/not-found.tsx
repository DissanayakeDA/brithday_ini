import Link from "next/link";
import { SearchX } from "lucide-react";

export default function InviteNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="glass flex max-w-md flex-col items-center p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-ink shadow-glow">
          <SearchX size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl text-cream">Invitation not found</h1>
        <p className="mt-2 text-sm text-cream/60">
          This invitation link is invalid or may have been removed. Please check the
          link, or contact your host for a new one.
        </p>
        <Link href="/" className="btn-ghost mt-6">
          Back to home
        </Link>
      </div>
    </main>
  );
}
