"use client";

import { useMutation, useQuery } from "convex/react";
import { useClerk } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  KanbanBoard,
  type KanbanColumnDef,
  type KanbanItem,
} from "@/components/ui/kanban";

/**
 * THE GLUE LAYER.
 *
 * This is the only place where media-client-specific concepts (Lead,
 * "Billboard", "Cadence", Convex) meet the generic Kanban component.
 * The Kanban library itself remains domain-agnostic and reusable.
 */

type Lead = Doc<"leads">;

// Column definitions — edit this array to reshape the board for a
// different client. Column ids are stored as `status` on each lead.
const COLUMNS: KanbanColumnDef[] = [
  { id: "new", title: "New Lead", accentColor: "#22d3ee" },
  { id: "contacted", title: "Contacted", accentColor: "#38bdf8" },
  { id: "proposal", title: "Proposal Sent", accentColor: "#a78bfa" },
  { id: "won", title: "Closed Won", accentColor: "#34d399" },
  { id: "lost", title: "Closed Lost", accentColor: "#f87171" },
];

export function AdminDashboard({ email }: { email: string }) {
  const { signOut } = useClerk();
  const leads = useQuery(api.leads.listLeads);
  const updateStatus = useMutation(api.leads.updateLeadStatus);

  const logout = () => signOut({ redirectUrl: "/admin/login" });

  // Map Convex docs into the Kanban's generic item shape. All
  // domain-specific projection lives here — the Kanban component
  // never touches a Lead directly.
  const items: KanbanItem<Lead>[] = (leads ?? []).map((l) => ({
    id: l._id,
    status: l.status,
    title: l.fullName,
    subtitle: `${l.budget} · ${l.location}`,
    metadata: l,
  }));

  return (
    <div className="flex min-h-screen flex-col p-6 sm:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold tracking-wide text-zinc-100">
            Landingham &amp; Winningmore
          </span>
          <div className="hidden h-8 w-px bg-zinc-800 sm:block" />
          <p className="hidden text-sm text-zinc-400 sm:block">
            Signed in as <span className="text-cyan-300">{email}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
        >
          Log out
        </button>
      </header>

      {leads === undefined ? (
        <div className="text-sm text-zinc-500">Loading leads…</div>
      ) : (
        <KanbanBoard<Lead>
          className="flex-1"
          columns={COLUMNS}
          items={items}
          emptyColumnLabel="No leads here"
          onDragEnd={(id, _from, to) =>
            updateStatus({ id: id as Id<"leads">, status: to })
          }
          renderDetails={(item) => <LeadDetails lead={item.metadata!} />}
        />
      )}
    </div>
  );
}

/** Domain-specific modal body. Not part of the reusable Kanban package. */
function LeadDetails({ lead }: { lead: Lead }) {
  const booking = new Date(lead.bookingAt);
  return (
    <dl className="space-y-3">
      <Row label="Name" value={lead.fullName} />
      <Row label="Email" value={lead.email} />
      <Row label="Phone" value={lead.phone} />
      <Row label="Location" value={lead.location} />
      <Row label="Budget" value={lead.budget} />
      <Row label="Cadence" value={lead.cadence} />
      <Row label="Interests" value={lead.interests.join(", ")} />
      <Row
        label="Booked for"
        value={booking.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      />
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-900 pb-2">
      <dt className="text-xs uppercase tracking-wider text-zinc-500">{label}</dt>
      <dd className="text-right text-sm text-zinc-100">{value}</dd>
    </div>
  );
}
