import { MailPlus } from "lucide-react";

export function AdminEmptyState() {
  return (
    <div className="glass flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-gradient text-ink shadow-glow">
        <MailPlus size={28} />
      </div>
      <h3 className="mt-5 font-display text-xl text-cream">No invitees yet</h3>
      <p className="mt-2 max-w-sm text-sm text-cream/60">
        Add your first guest above to generate a personal invitation link you can copy
        or share over WhatsApp.
      </p>
    </div>
  );
}
