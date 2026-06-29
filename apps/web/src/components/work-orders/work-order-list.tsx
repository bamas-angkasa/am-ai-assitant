import Link from "next/link";
import { ArrowUpRight, Clock3, LockKeyhole, MapPin, MessageSquareText } from "lucide-react";
import { PriorityBadge, RecommendationStatusBadge, WorkOrderStatusBadge } from "@/components/status/badges";
import { EmptyState } from "@/components/page/states";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { WorkOrder } from "@/lib/types/maintenance";

export function WorkOrderList({ workOrders, selectedId, onSelect }: { workOrders: WorkOrder[]; selectedId?: string; onSelect?: (id: string) => void }) {
  if (!workOrders.length) return <EmptyState title="No work orders found" description="Try another filter or search term." />;
  return <div className="space-y-3">{workOrders.map((item) => <article key={item.id} className={cn("group rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md", item.id === selectedId ? "border-indigo-300 shadow-[0_0_0_3px_rgba(99,102,241,0.08)]" : "border-slate-200/80")}>
    <button type="button" className="w-full text-left" onClick={() => onSelect?.(item.id)}>
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{item.appfolio_id}</p><h3 className="mt-1 truncate text-sm font-semibold text-slate-900">{item.title}</h3></div><PriorityBadge priority={item.priority} /></div>
      <div className="mt-3 flex flex-wrap gap-1.5"><WorkOrderStatusBadge status={item.status} />{item.recommendation_status && <RecommendationStatusBadge status={item.recommendation_status} />}{item.has_internal_context && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700"><LockKeyhole className="h-3 w-3" />Internal</span>}</div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{item.property.name} · {item.unit?.label ?? "Common area"}</p>
      {item.latest_inbound_message && <p className="mt-2 line-clamp-2 flex gap-2 text-xs leading-5 text-slate-500"><MessageSquareText className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-400" /><span>{item.latest_inbound_message}</span></p>}
    </button>
    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3"><span className="flex items-center gap-1 text-[11px] text-slate-400"><Clock3 className="h-3 w-3" />Updated {formatRelativeTime(item.updated_at)}</span><Link href={`/work-orders/${item.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800">Open details <ArrowUpRight className="h-3 w-3" /></Link></div>
  </article>)}</div>;
}
