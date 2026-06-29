import { AlertTriangle, Check, DatabaseZap, LockKeyhole, ShieldCheck } from "lucide-react";
import { SyncHealthBadge } from "@/components/status/badges";
import { formatDateTime } from "@/lib/utils";
import type { WorkOrderDetail } from "@/lib/types/maintenance";

export function GuardrailsCard() {
  const rules = ["AI never sends messages automatically", "Manager approval is required before use", "# internal notes are excluded from audience drafts", "Missing ETA must be confirmed with the vendor", "Drafts must be grounded in synced source context", "Cost, legal, and liability claims are not allowed"];
  return <section className="surface-card overflow-hidden"><div className="border-b border-indigo-100 bg-indigo-50/70 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-indigo-900"><ShieldCheck className="h-4 w-4" />Phase 1 guardrails</div><p className="mt-1 text-xs text-indigo-600">Human-controlled by design</p></div><ul className="space-y-3 p-4">{rules.map((rule) => <li key={rule} className="flex gap-2 text-xs leading-5 text-slate-600"><span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-2.5 w-2.5" /></span>{rule}</li>)}</ul></section>;
}

export function AppFolioContextCard({ workOrder }: { workOrder: WorkOrderDetail }) {
  const internalCount = workOrder.notes.filter((item) => item.visibility !== "shareable").length;
  return <section className="surface-card p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><DatabaseZap className="h-4 w-4 text-indigo-600" /><h3 className="text-sm font-semibold">AppFolio context</h3></div><SyncHealthBadge status={workOrder.appfolio_context.sync_status} /></div><dl className="mt-4 divide-y divide-slate-100 text-sm"><Row label="External ID" value={workOrder.appfolio_context.work_order_external_id} /><Row label="Property" value={workOrder.property.name} /><Row label="Unit" value={workOrder.unit?.label ?? "Common area"} /><Row label="Tenant" value={workOrder.tenant?.name ?? "Unassigned"} /><Row label="Vendor" value={workOrder.vendor?.name ?? "Not assigned"} /><Row label="Last synced" value={formatDateTime(workOrder.appfolio_context.last_synced_at)} /></dl>{internalCount > 0 && <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"><LockKeyhole className="mt-0.5 h-4 w-4 flex-none" /><span>{internalCount} protected note{internalCount > 1 ? "s were" : " was"} excluded from the audience draft.</span></div>}{workOrder.appfolio_context.sync_status !== "healthy" && <div className="mt-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"><AlertTriangle className="h-4 w-4" />Review sync freshness before approving.</div>}</section>;
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"><dt className="text-xs font-medium text-slate-400">{label}</dt><dd className="text-right text-xs font-semibold text-slate-700">{value}</dd></div>; }
