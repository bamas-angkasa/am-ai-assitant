import { AlertTriangle, Bot, Link2Off, LockKeyhole } from "lucide-react";
import type { WorkOrderDetail } from "@/lib/types/maintenance";

export function InboxStats({ workOrders, unmatchedCount }: { workOrders: WorkOrderDetail[]; unmatchedCount: number }) {
  const stats = [
    { label: "Ready for review", value: workOrders.filter((item) => item.recommendation_status === "ready_for_review").length, icon: Bot, tone: "indigo" },
    { label: "High / urgent", value: workOrders.filter((item) => item.priority === "high" || item.priority === "urgent").length, icon: AlertTriangle, tone: "rose" },
    { label: "Internal context", value: workOrders.filter((item) => item.has_internal_context).length, icon: LockKeyhole, tone: "amber" },
    { label: "Needs matching", value: unmatchedCount, icon: Link2Off, tone: "slate" }
  ] as const;
  const tones = { indigo: "bg-indigo-50 text-indigo-600", rose: "bg-rose-50 text-rose-600", amber: "bg-amber-50 text-amber-600", slate: "bg-slate-100 text-slate-600" };
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="surface-card flex items-center gap-4 p-4"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[stat.tone]}`}><stat.icon className="h-5 w-5" /></div><div><p className="text-2xl font-semibold tracking-tight text-slate-950">{stat.value}</p><p className="text-xs font-medium text-slate-500">{stat.label}</p></div></div>)}</div>;
}
