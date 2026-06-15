"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Check,
  Clipboard,
  Clock3,
  DatabaseZap,
  FileText,
  Inbox,
  RefreshCw,
  ShieldCheck,
  UserRound,
  X
} from "lucide-react";
import {
  type AiRecommendation,
  type AuditEvent,
  type MaintenanceDataSet,
  type MaintenanceWorkOrder,
  getDemoMaintenanceData
} from "@appfolio-ai/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatStatus } from "@/lib/utils";

const initialData = getDemoMaintenanceData();

type ReviewAction = "approved" | "rejected" | "copied" | "manual_send_marked";

export function MaintenanceDashboard() {
  const [data, setData] = useState<MaintenanceDataSet>(initialData);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(initialData.workOrders[0]?.id ?? "");
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});

  const selectedWorkOrder = data.workOrders.find((workOrder) => workOrder.id === selectedWorkOrderId) ?? data.workOrders[0];
  const selectedRecommendation = data.recommendations.find((recommendation) => recommendation.workOrderId === selectedWorkOrder?.id);
  const selectedNotes = data.notes.filter((note) => note.workOrderId === selectedWorkOrder?.id);
  const selectedMessages = data.messages.filter((message) => message.workOrderId === selectedWorkOrder?.id);
  const selectedAudit = data.auditEvents.filter((event) => event.workOrderId === selectedWorkOrder?.id);

  const inboxStats = useMemo(() => {
    return {
      ready: data.recommendations.filter((item) => item.status === "ready_for_review").length,
      urgent: data.workOrders.filter((item) => item.priority === "urgent" || item.priority === "high").length,
      internalNotes: data.notes.filter((item) => item.isInternalOnly).length
    };
  }, [data]);

  function handleReviewAction(recommendation: AiRecommendation, action: ReviewAction) {
    const editedDraft = draftEdits[recommendation.id] ?? recommendation.draftReply;
    const actor = "Maya Chen";
    const actionLabel = formatStatus(action);

    setData((current) => ({
      ...current,
      recommendations: current.recommendations.map((item) =>
        item.id === recommendation.id
          ? {
              ...item,
              status: action,
              finalEditedReply: editedDraft,
              updatedAt: new Date().toISOString()
            }
          : item
      ),
      auditEvents: [
        ...current.auditEvents,
        {
          id: `audit-${Date.now()}`,
          workOrderId: recommendation.workOrderId,
          recommendationId: recommendation.id,
          actor,
          action,
          description:
            action === "manual_send_marked"
              ? "Manager marked the approved draft as manually sent outside this system."
              : `Manager ${actionLabel.toLowerCase()} the AI recommendation.`,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  }

  function handleResetDemo() {
    const nextData = getDemoMaintenanceData();
    setData(nextData);
    setSelectedWorkOrderId(nextData.workOrders[0]?.id ?? "");
    setDraftEdits({});
  }

  if (!selectedWorkOrder || !selectedRecommendation) {
    return null;
  }

  return (
    <main className="soft-app-bg min-h-screen text-[#111827]">
      <header className="glass-panel sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white shadow-violet">
            <Bot className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-primary sm:text-lg">AppFolio Maintenance AI</h1>
            <p className="truncate text-xs text-[#667085]">Phase 1 internal inbox with human-approved drafts</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Badge variant="success">
            <DatabaseZap className="h-3 w-3" />
            AppFolio sync healthy
          </Badge>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-violet">
            <UserRound className="h-4 w-4" />
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-r border-border/80 bg-white/[0.35]">
          <div className="space-y-4 p-4">
            <section className="glass-card rounded-[20px] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">Live Ops</p>
                  <h2 className="text-lg font-semibold">Maintenance Inbox</h2>
                </div>
                <Button variant="outline" size="icon" onClick={handleResetDemo} aria-label="Reset demo data" title="Reset demo data">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Stat label="Ready" value={inboxStats.ready} />
                <Stat label="Priority" value={inboxStats.urgent} />
                <Stat label="Internal" value={inboxStats.internalNotes} />
              </div>
            </section>

            <section className="space-y-3">
              {data.workOrders.map((workOrder) => {
                const recommendation = data.recommendations.find((item) => item.workOrderId === workOrder.id);
                const active = workOrder.id === selectedWorkOrder.id;
                return (
                  <button
                    key={workOrder.id}
                    type="button"
                    onClick={() => setSelectedWorkOrderId(workOrder.id)}
                    className={cn(
                      "glass-card w-full rounded-[20px] p-4 text-left transition hover:border-primary/40",
                      active ? "border-primary/40 bg-white/90" : "bg-white/70"
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{workOrder.title}</p>
                        <p className="text-xs text-[#667085]">{workOrder.appfolioId}</p>
                      </div>
                      <PriorityBadge priority={workOrder.priority} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="muted">{formatStatus(workOrder.status)}</Badge>
                      <Badge variant={recommendation?.status === "ready_for_review" ? "warning" : "success"}>
                        {formatStatus(recommendation?.status ?? "queued")}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </section>
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6">
          <div className="mx-auto grid max-w-7xl gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-4">
              <WorkOrderHeader workOrder={selectedWorkOrder} data={data} />
              <RecommendationPanel
                recommendation={selectedRecommendation}
                draftValue={draftEdits[selectedRecommendation.id] ?? selectedRecommendation.finalEditedReply ?? selectedRecommendation.draftReply}
                onDraftChange={(value) => setDraftEdits((current) => ({ ...current, [selectedRecommendation.id]: value }))}
                onAction={handleReviewAction}
              />
              <Timeline notes={selectedNotes} messages={selectedMessages} auditEvents={selectedAudit} />
            </div>
            <ContextPanel workOrder={selectedWorkOrder} data={data} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-white/70 p-3">
      <p className="text-xl font-semibold text-primary">{value}</p>
      <p className="text-xs text-[#667085]">{label}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: MaintenanceWorkOrder["priority"] }) {
  const variant = priority === "urgent" || priority === "high" ? "danger" : priority === "medium" ? "warning" : "muted";
  return <Badge variant={variant}>{formatStatus(priority)}</Badge>;
}

function WorkOrderHeader({ workOrder, data }: { workOrder: MaintenanceWorkOrder; data: MaintenanceDataSet }) {
  const property = data.properties.find((item) => item.id === workOrder.propertyId);
  const unit = data.units.find((item) => item.id === workOrder.unitId);
  const tenant = data.contacts.find((item) => item.id === workOrder.tenantContactId);
  const vendor = data.contacts.find((item) => item.id === workOrder.vendorContactId);

  return (
    <section className="glass-card rounded-[20px] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge variant="default">{workOrder.appfolioId}</Badge>
            <PriorityBadge priority={workOrder.priority} />
            <Badge variant="muted">{formatStatus(workOrder.status)}</Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-normal">{workOrder.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">{workOrder.description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white/70 p-4 text-sm">
          <p className="font-semibold">{property?.name}</p>
          <p className="text-[#667085]">{unit?.label ?? "Common area"}</p>
          <p className="mt-2 text-[#667085]">Tenant: {tenant?.name ?? "Unassigned"}</p>
          <p className="text-[#667085]">Vendor: {vendor?.name ?? "Not assigned"}</p>
        </div>
      </div>
    </section>
  );
}

function RecommendationPanel({
  recommendation,
  draftValue,
  onDraftChange,
  onAction
}: {
  recommendation: AiRecommendation;
  draftValue: string;
  onDraftChange: (value: string) => void;
  onAction: (recommendation: AiRecommendation, action: ReviewAction) => void;
}) {
  return (
    <section className="glass-card rounded-[20px] p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Bot className="h-4 w-4" />
            AI Recommendation
          </div>
          <h3 className="text-lg font-semibold">{formatStatus(recommendation.detectedIntent)}</h3>
          <p className="mt-1 text-sm leading-6 text-[#667085]">{recommendation.summary}</p>
        </div>
        <Badge variant={recommendation.confidence === "high" ? "success" : "warning"}>{formatStatus(recommendation.confidence)} confidence</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="draft-reply">
            Draft for manual send
          </label>
          <textarea
            id="draft-reply"
            value={draftValue}
            onChange={(event) => onDraftChange(event.target.value)}
            className="min-h-40 w-full resize-y rounded-2xl border border-border bg-white/80 p-4 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => onAction(recommendation, "approved")}>
              <Check className="h-4 w-4" />
              Approve
            </Button>
            <Button variant="outline" onClick={() => onAction(recommendation, "copied")}>
              <Clipboard className="h-4 w-4" />
              Copy Approved Draft
            </Button>
            <Button variant="secondary" onClick={() => onAction(recommendation, "manual_send_marked")}>
              <FileText className="h-4 w-4" />
              Mark Manual Sent
            </Button>
            <Button variant="destructive" onClick={() => onAction(recommendation, "rejected")}>
              <X className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
        <aside className="rounded-2xl border border-border bg-white/70 p-4">
          <p className="mb-2 text-sm font-semibold">Recommended action</p>
          <p className="text-sm leading-6 text-[#667085]">{recommendation.recommendedAction}</p>
          <div className="mt-4 space-y-2">
            {recommendation.safetyFlags.length > 0 ? (
              recommendation.safetyFlags.map((flag) => (
                <div key={flag} className="flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                  <span>{flag}</span>
                </div>
              ))
            ) : (
              <div className="flex gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none" />
                <span>No deterministic safety flags found.</span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Timeline({
  notes,
  messages,
  auditEvents
}: {
  notes: MaintenanceDataSet["notes"];
  messages: MaintenanceDataSet["messages"];
  auditEvents: AuditEvent[];
}) {
  const items = [
    ...messages.map((item) => ({
      id: item.id,
      type: "Inbound message",
      body: item.body,
      date: item.receivedAt,
      tone: "message" as const
    })),
    ...notes.map((item) => ({
      id: item.id,
      type: item.isInternalOnly ? "Internal note" : "Work order note",
      body: item.body,
      date: item.createdAt,
      tone: item.isInternalOnly ? ("internal" as const) : ("note" as const)
    })),
    ...auditEvents.map((item) => ({
      id: item.id,
      type: formatStatus(item.action),
      body: item.description,
      date: item.createdAt,
      tone: "audit" as const
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="glass-card rounded-[20px] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Inbox className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Synced Timeline</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-white/70 p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant={item.tone === "internal" ? "warning" : item.tone === "audit" ? "success" : "muted"}>{item.type}</Badge>
              <span className="flex items-center gap-1 text-xs text-[#667085]">
                <Clock3 className="h-3 w-3" />
                {new Date(item.date).toLocaleString()}
              </span>
            </div>
            <p className="text-sm leading-6 text-[#344054]">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContextPanel({ workOrder, data }: { workOrder: MaintenanceWorkOrder; data: MaintenanceDataSet }) {
  const property = data.properties.find((item) => item.id === workOrder.propertyId);
  const unit = data.units.find((item) => item.id === workOrder.unitId);
  const tenant = data.contacts.find((item) => item.id === workOrder.tenantContactId);
  const vendor = data.contacts.find((item) => item.id === workOrder.vendorContactId);

  return (
    <aside className="space-y-4">
      <section className="glass-card rounded-[20px] p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Phase 1 Guardrails</h3>
        </div>
        <ul className="space-y-2 text-sm leading-6 text-[#667085]">
          <li>Inbound context is expected from AppFolio sync.</li>
          <li>Outbound messages are manually sent by a human.</li>
          <li>AI drafts require manager approval before use.</li>
          <li>Notes marked with # are excluded from tenant/vendor drafts.</li>
        </ul>
      </section>

      <section className="glass-card rounded-[20px] p-5">
        <h3 className="mb-4 text-sm font-semibold">AppFolio Context</h3>
        <dl className="space-y-3 text-sm">
          <ContextRow label="Property" value={property?.name ?? "Unknown"} />
          <ContextRow label="Address" value={property?.address ?? "Unknown"} />
          <ContextRow label="Unit" value={unit?.label ?? "Common area"} />
          <ContextRow label="Tenant" value={tenant?.name ?? "Unassigned"} />
          <ContextRow label="Vendor" value={vendor?.name ?? "Not assigned"} />
          <ContextRow label="Last sync" value={new Date(workOrder.lastAppfolioUpdatedAt).toLocaleString()} />
        </dl>
      </section>
    </aside>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white/70 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#98a2b3]">{label}</dt>
      <dd className="mt-1 text-[#344054]">{value}</dd>
    </div>
  );
}
