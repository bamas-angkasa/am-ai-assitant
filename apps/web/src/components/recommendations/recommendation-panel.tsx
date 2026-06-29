"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Bot, Check, Clipboard, FileCheck2, PencilLine, RefreshCw, Save, ShieldCheck, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge, RecommendationStatusBadge } from "@/components/status/badges";
import { formatStatus } from "@/lib/utils";
import { useMaintenance } from "@/lib/state/maintenance-provider";
import type { Recommendation } from "@/lib/types/maintenance";

export function AIRecommendationPanel({ recommendation }: { recommendation: Recommendation }) {
  const { pendingAction, editDraft, approve, reject, regenerate, copy, markManualSent } = useMaintenance();
  const [draft, setDraft] = useState(recommendation.final_edited_reply ?? recommendation.draft_reply);
  const [editing, setEditing] = useState(recommendation.status === "ready_for_review");
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const pending = pendingAction?.endsWith(recommendation.id) ?? false;
  const canReview = recommendation.status === "ready_for_review";
  const canRegenerate = recommendation.status === "failed" || recommendation.status === "rejected";
  const canCopy = recommendation.status === "approved" && Boolean(recommendation.approved_reply);
  const canMarkSent = recommendation.status === "approved";

  useEffect(() => {
    setDraft(recommendation.final_edited_reply ?? recommendation.draft_reply);
    setEditing(recommendation.status === "ready_for_review");
  }, [recommendation.id, recommendation.updated_at, recommendation.final_edited_reply, recommendation.draft_reply, recommendation.status]);

  async function handleApprove() {
    await approve(recommendation.id, { final_reply: draft, expected_version: recommendation.version });
    setEditing(false);
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    await reject(recommendation.id, { reason: rejectReason.trim(), expected_version: recommendation.version });
    setRejecting(false);
  }

  return <section className="surface-card overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/60 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-indigo-600"><Bot className="h-4 w-4" />AI recommendation <Sparkles className="h-3.5 w-3.5 text-violet-400" /></div><h3 className="mt-2 text-lg font-semibold text-slate-950">{formatStatus(recommendation.detected_intent)}</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{recommendation.summary}</p></div>
      <div className="flex flex-wrap gap-2"><RecommendationStatusBadge status={recommendation.status} /><ConfidenceBadge confidence={recommendation.confidence} /><Badge variant="muted">Audience: {formatStatus(recommendation.audience)}</Badge></div>
    </div>

    {recommendation.status === "failed" ? <div className="p-5"><div className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"><AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-rose-600" /><div><h4 className="text-sm font-semibold text-rose-900">Recommendation generation failed</h4><p className="mt-1 text-sm leading-6 text-rose-700">{recommendation.failure_reason}</p></div></div><Button className="mt-4" onClick={() => regenerate(recommendation.id)} disabled={pending}><RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} />Regenerate recommendation</Button></div> : <div className="grid xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="border-b border-slate-100 p-5 xl:border-b-0 xl:border-r">
        <div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">Draft for manual delivery</p><p className="mt-0.5 text-xs text-slate-400">Review and edit before approval. This system cannot send it.</p></div>{canReview && <Button variant="ghost" size="sm" onClick={() => setEditing((value) => !value)}><PencilLine className="h-3.5 w-3.5" />{editing ? "Preview" : "Edit"}</Button>}</div>
        {editing && canReview ? <textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-44 w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" aria-label="Recommendation draft" /> : <div className="min-h-36 whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700">{recommendation.approved_reply ?? draft}</div>}
        {recommendation.delivery_status !== "not_copied" && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700"><FileCheck2 className="h-4 w-4" />{recommendation.delivery_status === "copied" ? "Approved draft copied for manual delivery" : "Manager recorded manual delivery"}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {canReview && <><Button onClick={handleApprove} disabled={pending || !draft.trim()}><Check className="h-4 w-4" />Approve draft</Button><Button variant="outline" onClick={() => editDraft(recommendation.id, draft)} disabled={pending || draft === (recommendation.final_edited_reply ?? recommendation.draft_reply)}><Save className="h-4 w-4" />Save edit</Button><Button variant="destructive" onClick={() => setRejecting(true)} disabled={pending}><X className="h-4 w-4" />Reject</Button></>}
          {canRegenerate && <Button onClick={() => regenerate(recommendation.id)} disabled={pending}><RefreshCw className="h-4 w-4" />Regenerate</Button>}
          <Button variant="outline" onClick={() => copy(recommendation.id)} disabled={!canCopy || pending}><Clipboard className="h-4 w-4" />Copy approved draft</Button>
          <Button variant="secondary" onClick={() => markManualSent(recommendation.id, { channel: "appfolio" })} disabled={!canMarkSent || recommendation.delivery_status === "manual_sent" || pending}><FileCheck2 className="h-4 w-4" />Mark manually sent</Button>
        </div>
        {rejecting && <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4"><label htmlFor={`reject-${recommendation.id}`} className="text-sm font-semibold text-rose-900">Reason for rejection</label><textarea id={`reject-${recommendation.id}`} value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} placeholder="Explain what needs to change..." className="mt-2 min-h-20 w-full rounded-xl border border-rose-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" /><div className="mt-2 flex gap-2"><Button variant="destructive" size="sm" disabled={!rejectReason.trim() || pending} onClick={handleReject}>Confirm rejection</Button><Button variant="ghost" size="sm" onClick={() => setRejecting(false)}>Cancel</Button></div></div>}
      </div>

      <aside className="space-y-5 p-5"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Recommended action</p><p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.recommended_action}</p></div><SafetyFlags recommendation={recommendation} /><SourceContextList recommendation={recommendation} /></aside>
    </div>}
  </section>;
}

function SafetyFlags({ recommendation }: { recommendation: Recommendation }) {
  if (!recommendation.safety_flags.length) return <div className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><ShieldCheck className="mt-0.5 h-4 w-4 flex-none" />No deterministic safety flags found.</div>;
  return <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Safety flags</p><div className="space-y-2">{recommendation.safety_flags.map((flag) => <div key={flag.id} className={`flex gap-2 rounded-xl border p-3 text-xs leading-5 ${flag.severity === "critical" ? "border-rose-200 bg-rose-50 text-rose-800" : flag.severity === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-indigo-100 bg-indigo-50 text-indigo-800"}`}><AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />{flag.message}</div>)}</div></div>;
}

function SourceContextList({ recommendation }: { recommendation: Recommendation }) {
  if (!recommendation.source_context.length) return null;
  return <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Source context</p><div className="space-y-2">{recommendation.source_context.map((source) => <div key={source.id} className={`rounded-xl border p-3 ${source.included ? "border-slate-100 bg-slate-50" : "border-amber-200 bg-amber-50"}`}><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold text-slate-700">{source.label}</p><Badge variant={source.included ? "success" : "warning"}>{source.included ? "Used" : "Excluded"}</Badge></div><p className="mt-1.5 text-xs leading-5 text-slate-500">{source.excerpt}</p>{source.exclusion_reason && <p className="mt-1 text-[11px] font-semibold text-amber-700">{source.exclusion_reason}</p>}</div>)}</div></div>;
}
