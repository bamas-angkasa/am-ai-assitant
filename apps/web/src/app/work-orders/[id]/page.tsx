"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Bot, FileImage, History, LayoutDashboard, LockKeyhole, MessageSquareText, NotebookPen, Paperclip } from "lucide-react";
import { AIRecommendationPanel } from "@/components/recommendations/recommendation-panel";
import { AppFolioContextCard, GuardrailsCard } from "@/components/appfolio/context-cards";
import { EmptyState } from "@/components/page/states";
import { Timeline } from "@/components/timeline/timeline";
import { WorkOrderHeader } from "@/components/work-orders/work-order-header";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime, formatStatus } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard }, { id: "notes", label: "Notes", icon: NotebookPen }, { id: "messages", label: "Messages", icon: MessageSquareText }, { id: "attachments", label: "Attachments", icon: Paperclip }, { id: "history", label: "History", icon: History }, { id: "ai_activity", label: "AI Activity", icon: Bot }
] as const;
type Tab = (typeof tabs)[number]["id"];

export default function WorkOrderDetailPage({ params }: { params: { id: string } }) {
  const { snapshot } = useMaintenance();
  const [tab, setTab] = useState<Tab>("overview");
  const workOrder = snapshot.work_orders.find((item) => item.id === params.id);
  if (!workOrder) return <div className="space-y-5"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"><ArrowLeft className="h-4 w-4" />Back to inbox</Link><EmptyState title="Work order not found" description="The work order may have been removed or is outside your assigned portfolio." /></div>;
  const events = snapshot.timeline_events.filter((item) => item.work_order_id === workOrder.id);

  return <div className="space-y-5">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-700"><ArrowLeft className="h-4 w-4" />Back to maintenance inbox</Link>
    <WorkOrderHeader workOrder={workOrder} />
    <nav className="thin-scrollbar flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5" aria-label="Work order sections">{tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={cn("flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition", tab === item.id ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")}><item.icon className="h-3.5 w-3.5" />{item.label}{item.id === "notes" && <span className="text-[10px]">{workOrder.notes.length}</span>}{item.id === "messages" && <span className="text-[10px]">{workOrder.messages.length}</span>}</button>)}</nav>

    {tab === "overview" && <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-5">{workOrder.recommendation && <AIRecommendationPanel recommendation={workOrder.recommendation} />}<section className="surface-card p-5"><h3 className="mb-4 text-sm font-semibold text-slate-900">Approval and work-order history</h3><Timeline events={events} /></section></div><aside className="space-y-4"><AppFolioContextCard workOrder={workOrder} /><GuardrailsCard /></aside></div>}
    {tab === "notes" && <section className="surface-card p-5"><h2 className="text-base font-semibold">Work-order notes</h2><p className="mt-1 text-sm text-slate-500">Internal visibility comes from AppFolio markers and deterministic classification.</p><div className="mt-5 space-y-3">{workOrder.notes.length ? workOrder.notes.map((item) => <article key={item.id} className={cn("rounded-2xl border p-4", item.visibility === "shareable" ? "border-slate-200 bg-white" : "border-amber-200 bg-amber-50")}><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><p className="text-sm font-semibold">{item.author}</p><Badge variant={item.visibility === "shareable" ? "muted" : "warning"}>{item.visibility !== "shareable" && <LockKeyhole className="h-3 w-3" />}{formatStatus(item.visibility)}</Badge></div><time className="text-xs text-slate-400">{formatDateTime(item.created_at)}</time></div><p className="mt-3 text-sm leading-6 text-slate-700">{item.body}</p>{item.excluded_from_audience_draft && <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-amber-700"><LockKeyhole className="h-3 w-3" />Excluded from tenant/vendor draft</p>}</article>) : <EmptyState title="No notes synced" description="AppFolio work-order notes will appear here." />}</div></section>}
    {tab === "messages" && <section className="surface-card p-5"><h2 className="text-base font-semibold">Inbound communication</h2><div className="mt-5 space-y-3">{workOrder.messages.length ? workOrder.messages.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">{item.sender.name}</p><p className="mt-0.5 text-xs text-slate-400">{formatStatus(item.channel)} · {formatDateTime(item.received_at)}</p></div><Badge variant={item.match_confidence === "high" ? "success" : "warning"}>{item.match_confidence} match</Badge></div><p className="mt-3 text-sm leading-6 text-slate-700">{item.body}</p></article>) : <EmptyState title="No inbound messages" description="Synced AppFolio communication will appear here." />}</div></section>}
    {tab === "attachments" && <section className="surface-card p-5"><h2 className="text-base font-semibold">Attachments</h2><div className="mt-5">{workOrder.attachments.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{workOrder.attachments.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex h-28 items-center justify-center rounded-xl bg-slate-50 text-slate-400"><FileImage className="h-8 w-8" /></div><p className="mt-3 truncate text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-slate-400">{item.content_type} · {formatDateTime(item.created_at)}</p></article>)}</div> : <EmptyState title="No attachments available" description="Attachment references will appear when exposed by the AppFolio integration." icon={Paperclip} />}</div></section>}
    {tab === "history" && <section className="surface-card p-5"><h2 className="mb-4 text-base font-semibold">Complete history</h2><Timeline events={events} /></section>}
    {tab === "ai_activity" && <section className="surface-card p-5"><h2 className="mb-4 text-base font-semibold">AI and approval activity</h2><Timeline events={events.filter((item) => item.type === "ai_event" || item.type === "approval_event")} /></section>}
  </div>;
}
