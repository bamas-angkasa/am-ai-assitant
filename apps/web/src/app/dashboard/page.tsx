"use client";

import { useMemo, useState } from "react";
import { Filter, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { InboxStats } from "@/components/work-orders/inbox-stats";
import { WorkOrderList } from "@/components/work-orders/work-order-list";
import { WorkOrderHeader } from "@/components/work-orders/work-order-header";
import { AIRecommendationPanel } from "@/components/recommendations/recommendation-panel";
import { Timeline } from "@/components/timeline/timeline";
import { AppFolioContextCard, GuardrailsCard } from "@/components/appfolio/context-cards";
import { cn, formatStatus } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";
import type { WorkOrderFilters } from "@/lib/types/maintenance";

const filters: Array<{ value: NonNullable<WorkOrderFilters["view"]>; label: string }> = [
  { value: "ready_for_review", label: "Ready for review" }, { value: "needs_manual_matching", label: "Needs manual matching" }, { value: "urgent", label: "Urgent" }, { value: "waiting_vendor", label: "Waiting vendor" }, { value: "waiting_tenant", label: "Waiting tenant" }, { value: "stale", label: "Stale" }, { value: "failed_ai", label: "Failed AI" }, { value: "recently_approved", label: "Recently approved" }
];

export default function DashboardPage() {
  const { snapshot, reset, pendingAction } = useMaintenance();
  const [view, setView] = useState<NonNullable<WorkOrderFilters["view"]>>("ready_for_review");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(snapshot.work_orders[0]?.id ?? "");
  const unmatched = snapshot.manual_match_messages.filter((item) => item.status === "needs_review").length;

  const visible = useMemo(() => snapshot.work_orders.filter((item) => {
    const matchesQuery = !query || [item.title, item.appfolio_id, item.unit?.label, item.tenant?.name, item.vendor?.name].some((value) => value?.toLowerCase().includes(query.toLowerCase()));
    if (!matchesQuery) return false;
    if (view === "ready_for_review") return item.recommendation_status === "ready_for_review";
    if (view === "needs_manual_matching") return item.needs_manual_match;
    if (view === "urgent") return item.priority === "urgent" || item.priority === "high";
    if (view === "waiting_vendor") return item.status === "waiting_vendor";
    if (view === "waiting_tenant") return item.status === "waiting_tenant";
    if (view === "stale") return item.is_stale;
    if (view === "failed_ai") return item.recommendation_status === "failed";
    if (view === "recently_approved") return item.recommendation_status === "approved";
    return true;
  }), [snapshot.work_orders, query, view]);

  const selected = snapshot.work_orders.find((item) => item.id === selectedId) ?? visible[0] ?? snapshot.work_orders[0];
  const timeline = selected ? snapshot.timeline_events.filter((item) => item.work_order_id === selected.id) : [];

  return <div className="space-y-6">
    <PageHeader eyebrow="Live operations" title="Maintenance inbox" description="Review AppFolio-synced work orders, validate AI recommendations, and prepare human-approved responses." actions={<Button variant="outline" onClick={() => reset()} disabled={pendingAction === "reset"}><RefreshCw className={`h-4 w-4 ${pendingAction === "reset" ? "animate-spin" : ""}`} />Reset demo</Button>} />
    <InboxStats workOrders={snapshot.work_orders} unmatchedCount={unmatched} />
    <section className="surface-card p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search work orders, residents, vendors..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><SlidersHorizontal className="h-4 w-4" />Operational views</div></div><div className="thin-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">{filters.map((filter) => <button key={filter.value} type="button" onClick={() => setView(filter.value)} className={cn("whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold transition", view === filter.value ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800")}><Filter className="mr-1.5 inline h-3 w-3" />{filter.label}</button>)}</div></section>
    <div className="grid gap-5 xl:grid-cols-[350px_minmax(0,1fr)_300px]">
      <section className="min-w-0"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-800">{formatStatus(view)}</h2><span className="text-xs text-slate-400">{visible.length} cases</span></div><div className="thin-scrollbar max-h-[calc(100vh-240px)] overflow-y-auto pr-1"><WorkOrderList workOrders={visible} selectedId={selected?.id} onSelect={setSelectedId} /></div></section>
      <section className="min-w-0 space-y-5">{selected ? <><WorkOrderHeader workOrder={selected} compact />{selected.recommendation && <AIRecommendationPanel recommendation={selected.recommendation} />}<section className="surface-card p-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-900">Recent activity</h3><span className="text-xs text-slate-400">Synced timeline</span></div><Timeline events={timeline} limit={4} /></section></> : <div className="surface-card p-8 text-center text-sm text-slate-500">Select a work order to review it.</div>}</section>
      {selected && <aside className="space-y-4"><GuardrailsCard /><AppFolioContextCard workOrder={selected} /></aside>}
    </div>
  </div>;
}
