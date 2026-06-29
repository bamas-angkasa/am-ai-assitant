"use client";

import { useState } from "react";
import { CheckCircle2, Link2, MessageSquareText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/page/states";
import { formatDateTime, formatStatus } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";
import type { ManualMatchMessage } from "@/lib/types/maintenance";

export function ManualMatchingTable({ messages }: { messages: ManualMatchMessage[] }) {
  const { matchMessage, pendingAction } = useMaintenance();
  const [selected, setSelected] = useState<Record<string, string>>(() => Object.fromEntries(messages.map((item) => [item.id, item.suggestions[0]?.work_order_id ?? ""])));
  if (!messages.length) return <EmptyState title="Matching queue is clear" description="Low-confidence inbound messages will appear here for manual review." icon={Link2} />;
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="hidden grid-cols-[1.1fr_1.5fr_100px_1.4fr_130px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 lg:grid"><span>Sender</span><span>Message</span><span>Confidence</span><span>Suggested work order</span><span className="text-right">Action</span></div><div className="divide-y divide-slate-100">{messages.map((message) => {
    const matched = message.status === "matched";
    return <article key={message.id} className="grid gap-4 p-5 lg:grid-cols-[1.1fr_1.5fr_100px_1.4fr_130px] lg:items-center">
      <div><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><MessageSquareText className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-slate-800">{message.sender.name}</p><p className="text-xs text-slate-400">{message.sender.phone ?? message.sender.email}</p></div></div><p className="mt-2 text-[11px] text-slate-400">{formatStatus(message.channel)} · {formatDateTime(message.received_at)}</p></div>
      <p className="text-sm leading-6 text-slate-600">{message.body}</p>
      <div><Badge variant={message.confidence_score < 0.5 ? "danger" : "warning"}>{Math.round(message.confidence_score * 100)}% low</Badge><p className="mt-1 text-[11px] text-slate-400">Needs review</p></div>
      <div>{matched ? <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Match confirmed</div> : <><label className="sr-only" htmlFor={`match-${message.id}`}>Suggested work order</label><select id={`match-${message.id}`} value={selected[message.id]} onChange={(event) => setSelected((current) => ({ ...current, [message.id]: event.target.value }))} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">{message.suggestions.map((suggestion) => <option key={suggestion.work_order_id} value={suggestion.work_order_id}>{suggestion.work_order_external_id} · {suggestion.title} ({Math.round(suggestion.score * 100)}%)</option>)}</select><p className="mt-1 flex items-center gap-1 text-[11px] text-indigo-500"><Sparkles className="h-3 w-3" />AI-suggested candidates</p></>}</div>
      <div className="lg:text-right">{matched ? <Badge variant="success">Matched</Badge> : <Button size="sm" onClick={() => matchMessage(message.id, selected[message.id])} disabled={!selected[message.id] || pendingAction === `match:${message.id}`}><Link2 className="h-3.5 w-3.5" />Match</Button>}</div>
    </article>;
  })}</div></div>;
}
