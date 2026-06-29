import { Activity, Bot, DatabaseZap, Gauge, Layers3, ServerCrash, Timer, TriangleAlert } from "lucide-react";
import { SyncHealthBadge } from "@/components/status/badges";
import { formatDateTime, formatStatus } from "@/lib/utils";
import type { IntegrationHealth, SyncRun } from "@/lib/types/maintenance";

export function SyncHealthOverview({ health }: { health: IntegrationHealth }) {
  const metrics = [
    { label: "Last successful sync", value: formatDateTime(health.last_successful_sync_at), icon: DatabaseZap }, { label: "Sync duration", value: `${Math.round(health.last_sync_duration_ms / 1000)} sec`, icon: Timer }, { label: "Records processed", value: health.records_processed.toLocaleString(), icon: Layers3 }, { label: "Records failed", value: String(health.records_failed), icon: TriangleAlert }, { label: "Queue depth", value: String(health.queue_depth), icon: Activity }, { label: "AI failures", value: String(health.ai_failure_count), icon: Bot }, { label: "Dead-letter queue", value: String(health.dead_letter_count), icon: ServerCrash }, { label: "API rate limit", value: `${health.rate_limit_remaining}/${health.rate_limit_total}`, icon: Gauge }
  ];
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="surface-card flex items-center gap-3 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><metric.icon className="h-5 w-5" /></div><div className="min-w-0"><p className="truncate text-lg font-semibold text-slate-950">{metric.value}</p><p className="text-xs text-slate-500">{metric.label}</p></div></div>)}</div>;
}

export function SyncEntityTable({ run }: { run: SyncRun }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1fr_100px_90px_90px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400"><span>Entity</span><span>Status</span><span className="text-right">Processed</span><span className="text-right">Failed</span></div><div className="divide-y divide-slate-100">{run.entities.map((item) => <div key={item.entity} className="grid grid-cols-[1fr_100px_90px_90px] items-center gap-3 px-4 py-3"><p className="text-sm font-semibold text-slate-700">{formatStatus(item.entity)}</p><SyncHealthBadge status={item.status} /><p className="text-right text-sm text-slate-600">{item.processed}</p><p className={`text-right text-sm font-semibold ${item.failed ? "text-rose-600" : "text-slate-400"}`}>{item.failed}</p></div>)}</div></div>;
}
