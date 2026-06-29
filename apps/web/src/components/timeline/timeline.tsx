import { Bot, CheckCircle2, DatabaseZap, LockKeyhole, MessageSquareText, NotebookPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/page/states";
import { formatDateTime } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/types/maintenance";

const icons = { inbound_message: MessageSquareText, shareable_note: NotebookPen, internal_note: LockKeyhole, status_change: CheckCircle2, ai_event: Bot, approval_event: CheckCircle2, sync_event: DatabaseZap };

export function Timeline({ events, limit }: { events: TimelineEvent[]; limit?: number }) {
  const items = [...events].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit);
  if (!items.length) return <EmptyState title="No activity yet" description="Synced notes, messages, and review actions will appear here." />;
  return <div className="relative space-y-0 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-slate-200">{items.map((event) => <TimelineItem key={event.id} event={event} />)}</div>;
}

export function TimelineItem({ event }: { event: TimelineEvent }) {
  const Icon = icons[event.type];
  return <article className="relative flex gap-4 py-3"><div className={`relative z-10 flex h-9 w-9 flex-none items-center justify-center rounded-xl border bg-white ${event.is_internal ? "border-amber-200 text-amber-600" : "border-indigo-100 text-indigo-600"}`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><h4 className="text-sm font-semibold text-slate-800">{event.title}</h4>{event.is_internal && <Badge variant="warning"><LockKeyhole className="h-3 w-3" />Internal</Badge>}</div><time className="text-[11px] text-slate-400">{formatDateTime(event.created_at)}</time></div>{event.actor && <p className="mt-1 text-xs font-medium text-slate-400">{event.actor}</p>}<p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>{event.type === "internal_note" && <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700"><LockKeyhole className="h-3 w-3" />Excluded from tenant/vendor draft</p>}</div></article>;
}
