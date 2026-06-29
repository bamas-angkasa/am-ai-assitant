"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Filter, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/page/page-header";
import { Button } from "@/components/ui/button";
import { InboxStats } from "@/components/work-orders/inbox-stats";
import { WorkOrderList } from "@/components/work-orders/work-order-list";
import { cn, formatStatus } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";
import type { WorkOrderFilters } from "@/lib/types/maintenance";

const filters: Array<{ value: NonNullable<WorkOrderFilters["view"]>; label: string }> = [
  { value: "ready_for_review", label: "Ready for review" },
  { value: "needs_manual_matching", label: "Needs manual matching" },
  { value: "urgent", label: "Urgent" },
  { value: "waiting_vendor", label: "Waiting vendor" },
  { value: "waiting_tenant", label: "Waiting tenant" },
  { value: "stale", label: "Stale" },
  { value: "failed_ai", label: "Failed AI" },
  { value: "recently_approved", label: "Recently approved" }
];

const defaultView: NonNullable<WorkOrderFilters["view"]> = "ready_for_review";

export default function DashboardPage() {
  return <Suspense fallback={<div className="surface-card min-h-64 animate-pulse bg-slate-100/60" aria-label="Loading maintenance inbox" />}><DashboardContent /></Suspense>;
}

function DashboardContent() {
  const { snapshot, reset, pendingAction } = useMaintenance();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view");
  const view = filters.some((filter) => filter.value === requestedView)
    ? requestedView as NonNullable<WorkOrderFilters["view"]>
    : defaultView;
  const query = searchParams.get("q") ?? "";
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

  function updateInboxUrl(next: { view?: NonNullable<WorkOrderFilters["view"]>; query?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextView = next.view ?? view;
    const nextQuery = next.query ?? query;
    if (nextView === defaultView) params.delete("view"); else params.set("view", nextView);
    if (nextQuery.trim()) params.set("q", nextQuery); else params.delete("q");
    const suffix = params.toString();
    window.history.replaceState(null, "", suffix ? `${pathname}?${suffix}` : pathname);
  }

  const currentParams = searchParams.toString();
  const returnTo = currentParams ? `${pathname}?${currentParams}` : pathname;

  return <div className="space-y-6">
    <PageHeader eyebrow="Live operations" title="Maintenance inbox" description="Select a case to review its AppFolio context and AI recommendation." actions={<Button variant="outline" onClick={() => reset()} disabled={pendingAction === "reset"}><RefreshCw className={`h-4 w-4 ${pendingAction === "reset" ? "animate-spin" : ""}`} />Reset demo</Button>} />
    <InboxStats workOrders={snapshot.work_orders} unmatchedCount={unmatched} />
    <section className="surface-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative min-w-0 flex-1 sm:min-w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => updateInboxUrl({ query: event.target.value })} placeholder="Search work orders, residents, vendors..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></div><div className="flex items-center gap-2 text-xs font-semibold text-slate-400"><SlidersHorizontal className="h-4 w-4" />Operational views</div></div>
      <div className="thin-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">{filters.map((filter) => <button key={filter.value} type="button" onClick={() => updateInboxUrl({ view: filter.value })} className={cn("whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold transition", view === filter.value ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800")}><Filter className="mr-1.5 inline h-3 w-3" />{filter.label}</button>)}</div>
    </section>
    <section>
      <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-800">{formatStatus(view)}</h2><span className="text-xs text-slate-400">{visible.length} cases</span></div>
      <WorkOrderList workOrders={visible} returnTo={returnTo} />
    </section>
  </div>;
}
