import { AlertTriangle, CheckCircle2, CircleDashed, Clock3, DatabaseZap, ShieldAlert, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatStatus } from "@/lib/utils";
import type { ConfidenceLevel, RecommendationStatus, SyncStatus, WorkOrderPriority, WorkOrderStatus } from "@/lib/types/maintenance";

export function PriorityBadge({ priority }: { priority: WorkOrderPriority }) {
  const variant = priority === "urgent" || priority === "high" ? "danger" : priority === "medium" ? "warning" : "muted";
  return <Badge variant={variant}>{priority === "urgent" && <AlertTriangle className="h-3 w-3" />}{formatStatus(priority)}</Badge>;
}

export function WorkOrderStatusBadge({ status }: { status: WorkOrderStatus }) {
  const variant = status === "resolved" || status === "closed" ? "success" : status.startsWith("waiting") ? "warning" : "muted";
  return <Badge variant={variant}>{formatStatus(status)}</Badge>;
}

export function RecommendationStatusBadge({ status }: { status: RecommendationStatus }) {
  const variant = status === "approved" ? "success" : status === "failed" || status === "rejected" ? "danger" : status === "ready_for_review" ? "warning" : "muted";
  const Icon = status === "approved" ? CheckCircle2 : status === "failed" || status === "rejected" ? XCircle : status === "ready_for_review" ? Clock3 : CircleDashed;
  return <Badge variant={variant}><Icon className="h-3 w-3" />{formatStatus(status)}</Badge>;
}

export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  return <Badge variant={confidence === "high" ? "success" : confidence === "medium" ? "warning" : "danger"}>{formatStatus(confidence)} confidence</Badge>;
}

export function SyncHealthBadge({ status, label }: { status: SyncStatus; label?: string }) {
  const variant = status === "healthy" ? "success" : status === "failed" ? "danger" : "warning";
  const Icon = status === "healthy" ? DatabaseZap : status === "failed" ? ShieldAlert : CircleDashed;
  return <Badge variant={variant}><Icon className="h-3 w-3" />{label ?? formatStatus(status)}</Badge>;
}
