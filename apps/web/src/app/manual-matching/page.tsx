"use client";

import { Link2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page/page-header";
import { ManualMatchingTable } from "@/components/manual-matching/manual-matching-table";
import { useMaintenance } from "@/lib/state/maintenance-provider";

export default function ManualMatchingPage() {
  const { snapshot } = useMaintenance();
  const pending = snapshot.manual_match_messages.filter((item) => item.status === "needs_review").length;
  return <div className="space-y-6"><PageHeader eyebrow="Message operations" title="Manual matching" description="Review inbound communication that could not be confidently linked to an AppFolio work order." /><div className="grid gap-3 sm:grid-cols-2"><div className="surface-card flex items-center gap-4 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Link2 className="h-5 w-5" /></div><div><p className="text-2xl font-semibold">{pending}</p><p className="text-xs text-slate-500">Messages needing review</p></div></div><div className="surface-card flex items-center gap-4 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-sm font-semibold">Human confirmation required</p><p className="mt-1 text-xs text-slate-500">AI suggestions never link records automatically</p></div></div></div><ManualMatchingTable messages={snapshot.manual_match_messages} /></div>;
}
