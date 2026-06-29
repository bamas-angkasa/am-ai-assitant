import { Building2, CalendarDays, Clock3, MapPin, UserRound, Wrench } from "lucide-react";
import { PriorityBadge, WorkOrderStatusBadge } from "@/components/status/badges";
import { formatDateTime } from "@/lib/utils";
import type { WorkOrderDetail } from "@/lib/types/maintenance";

export function WorkOrderHeader({ workOrder, compact = false }: { workOrder: WorkOrderDetail; compact?: boolean }) {
  return <section className="surface-card p-5 sm:p-6"><div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">{workOrder.appfolio_id}</span><PriorityBadge priority={workOrder.priority} /><WorkOrderStatusBadge status={workOrder.status} /></div><h2 className={`${compact ? "text-xl" : "text-2xl"} mt-3 font-semibold tracking-tight text-slate-950`}>{workOrder.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{workOrder.description}</p></div><div className="grid min-w-[260px] grid-cols-2 gap-x-5 gap-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs"><Meta icon={Building2} label="Property" value={workOrder.property.name} /><Meta icon={MapPin} label="Unit" value={workOrder.unit?.label ?? "Common area"} /><Meta icon={UserRound} label="Tenant" value={workOrder.tenant?.name ?? "Unassigned"} /><Meta icon={Wrench} label="Vendor" value={workOrder.vendor?.name ?? "Not assigned"} />{!compact && <><Meta icon={CalendarDays} label="Created" value={formatDateTime(workOrder.created_at)} /><Meta icon={Clock3} label="Last synced" value={formatDateTime(workOrder.last_appfolio_sync_at)} /></>}</div></div></section>;
}

function Meta({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return <div className="min-w-0"><p className="flex items-center gap-1.5 font-medium text-slate-400"><Icon className="h-3.5 w-3.5" />{label}</p><p className="mt-1 truncate font-semibold text-slate-700" title={value}>{value}</p></div>;
}
