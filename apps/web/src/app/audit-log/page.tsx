"use client";

import { useMemo, useState } from "react";
import { Bot, CheckCircle2, ChevronDown, Clipboard, FileClock, Link2, LockKeyhole, PencilLine, RefreshCw, Search, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page/page-header";
import { EmptyState } from "@/components/page/states";
import { formatDateTime, formatStatus } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";
import type { AuditAction } from "@/lib/types/maintenance";

const actions: Array<AuditAction | "all"> = ["all", "recommendation_generated", "draft_edited", "draft_approved", "draft_rejected", "draft_copied", "manual_send_marked", "recommendation_regenerated", "manual_match_completed", "work_order_synced"];
const icons: Record<AuditAction, typeof Bot> = { recommendation_generated: Bot, draft_edited: PencilLine, draft_approved: CheckCircle2, draft_rejected: XCircle, draft_copied: Clipboard, manual_send_marked: CheckCircle2, recommendation_regenerated: RefreshCw, manual_match_completed: Link2, work_order_synced: FileClock };

export default function AuditLogPage() {
  const { snapshot } = useMaintenance();
  const [query, setQuery] = useState("");
  const [action, setAction] = useState<AuditAction | "all">("all");
  const events = useMemo(() => snapshot.audit_events.filter((event) => (action === "all" || event.action === action) && (!query || [event.actor_name, event.work_order_external_id, event.recommendation_id, event.description].some((value) => value?.toLowerCase().includes(query.toLowerCase())))).sort((a, b) => b.created_at.localeCompare(a.created_at)), [snapshot.audit_events, action, query]);
  return <div className="space-y-6"><PageHeader eyebrow="Accountability" title="Audit log" description="Trace every AI generation, draft change, approval decision, copy, and manual delivery event." /><section className="surface-card flex flex-col gap-3 p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actor, work order, recommendation..." className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></div><select value={action} onChange={(event) => setAction(event.target.value as AuditAction | "all")} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none" aria-label="Filter by audit action">{actions.map((item) => <option key={item} value={item}>{formatStatus(item)}</option>)}</select></section>
    {!events.length ? <EmptyState title="No audit events found" description="Try broadening your search or action filter." icon={FileClock} /> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="divide-y divide-slate-100">{events.map((event) => { const Icon = icons[event.action]; return <details key={event.id} className="group"><summary className="grid cursor-pointer list-none gap-3 p-5 hover:bg-slate-50 lg:grid-cols-[160px_140px_1fr_120px_1.4fr_24px] lg:items-center"><time className="text-xs text-slate-500">{formatDateTime(event.created_at)}</time><p className="text-sm font-semibold">{event.actor_name}</p><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon className="h-4 w-4" /></span><span className="text-sm font-semibold text-slate-700">{formatStatus(event.action)}</span></div><p className="text-xs font-semibold text-indigo-700">{event.work_order_external_id ?? "—"}</p><div><p className="text-xs leading-5 text-slate-500">{event.description}</p>{event.excluded_internal_context && <Badge variant="warning" className="mt-1"><LockKeyhole className="h-3 w-3" />Internal excluded</Badge>}</div><ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" /></summary><div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs text-slate-500">Before: {event.before_summary ?? "No snapshot"} · After: {event.after_summary ?? event.description}<p className="mt-2 text-[11px] text-slate-400">Audit ID: {event.id} · Resource: {event.resource_id}</p></div></details>; })}</div></div>}
  </div>;
}
