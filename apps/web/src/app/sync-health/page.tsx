"use client";

import { DatabaseZap } from "lucide-react";
import { PageHeader } from "@/components/page/page-header";
import { SyncHealthBadge } from "@/components/status/badges";
import { SyncEntityTable, SyncHealthOverview } from "@/components/sync-health/sync-health-overview";
import { formatDateTime } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";

export default function SyncHealthPage() {
  const { snapshot } = useMaintenance();
  const latest = snapshot.sync_runs[0];
  return <div className="space-y-6"><PageHeader eyebrow="Integration operations" title="Sync health" description="Monitor AppFolio ingestion, queue pressure, entity freshness, and recent integration failures." actions={<SyncHealthBadge status={snapshot.integration_health.appfolio_status} label="AppFolio connection healthy" />} /><SyncHealthOverview health={snapshot.integration_health} /><div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.7fr)]"><section><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-800">Entity sync status</h2><span className="text-xs text-slate-400">Latest run · {formatDateTime(latest.started_at)}</span></div><SyncEntityTable run={latest} /></section><section className="surface-card p-5"><div className="flex items-center gap-2"><DatabaseZap className="h-4 w-4 text-indigo-600" /><h2 className="text-sm font-semibold">Recent sync runs</h2></div><div className="mt-5 space-y-4">{snapshot.sync_runs.map((run, index) => <article key={run.id} className="relative flex gap-3 before:absolute before:bottom-[-16px] before:left-[15px] before:top-8 before:w-px before:bg-slate-200 last:before:hidden"><span className={`relative z-10 mt-0.5 h-8 w-8 flex-none rounded-xl border-4 border-white ${run.status === "healthy" ? "bg-emerald-500" : run.status === "partial" ? "bg-amber-500" : "bg-rose-500"}`} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{index === 0 ? "Latest AppFolio sync" : `Sync run ${run.id}`}</p><SyncHealthBadge status={run.status} /></div><p className="mt-1 text-xs text-slate-400">{formatDateTime(run.started_at)} · {run.records_processed.toLocaleString()} records · {Math.round((run.duration_ms ?? 0) / 1000)}s</p>{run.error_summary && <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-700">{run.error_summary}</p>}</div></article>)}</div></section></div></div>;
}
