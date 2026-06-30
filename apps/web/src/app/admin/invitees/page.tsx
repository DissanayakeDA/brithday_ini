"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, PartyPopper, Users } from "lucide-react";
import { toast } from "sonner";
import type { CreateGuestInput, Guest } from "@bday/shared";
import { SCOPE_LABELS } from "@bday/shared";
import { guestsApi } from "@/lib/api";
import { EVENT } from "@/lib/config";
import { InviteeForm } from "@/components/admin/InviteeForm";
import { GeneratedLinkCard } from "@/components/admin/GeneratedLinkCard";
import { InviteeTable } from "@/components/admin/InviteeTable";
import { InviteeList } from "@/components/admin/InviteeList";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Modal } from "@/components/ui/Modal";

export default function AdminInviteePage() {
  const [guests, setGuests] = useState<Guest[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [generated, setGenerated] = useState<Guest | null>(null);

  const [editing, setEditing] = useState<Guest | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState<Guest | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function load() {
    try {
      setLoadError(null);
      setGuests(await guestsApi.list());
    } catch (err) {
      setGuests([]);
      setLoadError(err instanceof Error ? err.message : "Failed to load invitees.");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(values: CreateGuestInput) {
    setCreating(true);
    try {
      const guest = await guestsApi.create(values);
      setGuests((prev) => [guest, ...(prev ?? [])]);
      setGenerated(guest);
      toast.success(`Invitation created for ${guest.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create invitee.");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(values: CreateGuestInput) {
    if (!editing) return;
    setSavingEdit(true);
    try {
      const updated = await guestsApi.update(editing.id, values);
      setGuests((prev) => (prev ?? []).map((g) => (g.id === updated.id ? updated : g)));
      toast.success("Invitee updated");
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update invitee.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await guestsApi.remove(deleting.id);
      setGuests((prev) => (prev ?? []).filter((g) => g.id !== deleting.id));
      if (generated?.id === deleting.id) setGenerated(null);
      toast.success("Invitee deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete invitee.");
    } finally {
      setDeleteBusy(false);
    }
  }

  const stats = useMemo(() => {
    const list = guests ?? [];
    return {
      total: list.length,
      single: list.filter((g) => g.invitationScope === "single").length,
      couple: list.filter((g) => g.invitationScope === "couple").length,
      family: list.filter((g) => g.invitationScope === "family").length,
    };
  }, [guests]);

  const isLoading = guests === null;
  const isEmpty = !isLoading && guests.length === 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 text-gold-light">
          <PartyPopper size={18} />
          <span className="text-xs font-medium uppercase tracking-[0.2em]">
            Invitation Manager
          </span>
        </div>
        <h1 className="font-display text-3xl text-cream sm:text-4xl">
          {EVENT.title}
        </h1>
        <p className="text-sm text-cream/60">
          {EVENT.venue} &middot; {EVENT.dateLabel}. Add guests below to generate and
          share personal invitation links.
        </p>
      </motion.header>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total invitees", value: stats.total, icon: Users },
          { label: SCOPE_LABELS.single, value: stats.single },
          { label: SCOPE_LABELS.couple, value: stats.couple },
          { label: SCOPE_LABELS.family, value: stats.family },
        ].map((card) => (
          <div key={card.label} className="glass px-4 py-3">
            <p className="text-xs text-cream/50">{card.label}</p>
            <p className="mt-1 font-display text-2xl text-cream">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Add invitee */}
      <section className="glass mt-6 p-5 sm:p-6">
        <h2 className="mb-4 font-display text-xl text-cream">Add a new invitee</h2>
        <InviteeForm busy={creating} onSubmit={handleCreate} />
        <GeneratedLinkCard guest={generated} onDismiss={() => setGenerated(null)} />
      </section>

      {/* List */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-cream">Invitees</h2>
          {!isLoading && !isEmpty && (
            <span className="text-sm text-cream/50">{stats.total} total</span>
          )}
        </div>

        {loadError && (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p>{loadError}</p>
              <button onClick={() => void load()} className="mt-1 underline">
                Retry
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="glass flex items-center justify-center gap-2 px-6 py-16 text-cream/60">
            <Loader2 className="animate-spin" size={18} /> Loading invitees…
          </div>
        ) : isEmpty ? (
          <AdminEmptyState />
        ) : (
          <>
            <InviteeTable guests={guests} onEdit={setEditing} onDelete={setDeleting} />
            <InviteeList guests={guests} onEdit={setEditing} onDelete={setDeleting} />
          </>
        )}
      </section>

      {/* Edit modal */}
      <Modal open={!!editing} title="Edit invitee" onClose={() => setEditing(null)}>
        {editing && (
          <InviteeForm
            initial={{ name: editing.name, invitationScope: editing.invitationScope }}
            submitLabel="Save changes"
            busy={savingEdit}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleting} title="Delete invitee?" onClose={() => setDeleting(null)}>
        <p className="text-sm text-cream/70">
          This will permanently remove{" "}
          <span className="font-medium text-cream">{deleting?.name}</span> and their
          invitation link. This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setDeleting(null)}>
            Cancel
          </button>
          <button
            className="btn border border-rose-400/40 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30"
            disabled={deleteBusy}
            onClick={() => void handleDelete()}
          >
            {deleteBusy && <Loader2 size={16} className="animate-spin" />}
            Delete invitee
          </button>
        </div>
      </Modal>
    </main>
  );
}
