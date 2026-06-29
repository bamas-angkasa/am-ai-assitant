import { ApiError, type MaintenanceApi } from "@/lib/api/maintenance-api";
import { createMockSnapshot } from "@/lib/mock/fixtures";
import type {
  ApproveRecommendationPayload,
  AuditAction,
  AuditFilters,
  MaintenanceSnapshot,
  ManualSendPayload,
  Recommendation,
  RejectRecommendationPayload,
  WorkOrderDetail,
  WorkOrderFilters
} from "@/lib/types/maintenance";

export class MockMaintenanceApi implements MaintenanceApi {
  private snapshot = createMockSnapshot();

  getSnapshot() {
    return structuredClone(this.snapshot);
  }

  async listWorkOrders(filters: WorkOrderFilters = {}) {
    let items = this.snapshot.work_orders;
    const query = filters.query?.trim().toLowerCase();
    if (query) {
      items = items.filter((item) => [item.title, item.appfolio_id, item.property.name, item.unit?.label, item.tenant?.name, item.vendor?.name].some((value) => value?.toLowerCase().includes(query)));
    }
    if (filters.view && filters.view !== "all") {
      items = items.filter((item) => {
        if (filters.view === "ready_for_review") return item.recommendation_status === "ready_for_review";
        if (filters.view === "needs_manual_matching") return item.needs_manual_match;
        if (filters.view === "urgent") return item.priority === "urgent" || item.priority === "high";
        if (filters.view === "waiting_vendor") return item.status === "waiting_vendor";
        if (filters.view === "waiting_tenant") return item.status === "waiting_tenant";
        if (filters.view === "stale") return item.is_stale;
        if (filters.view === "failed_ai") return item.recommendation_status === "failed";
        if (filters.view === "recently_approved") return item.recommendation_status === "approved";
        return true;
      });
    }
    return { items: structuredClone(items) };
  }

  async getWorkOrder(id: string) {
    return structuredClone(this.findWorkOrder(id));
  }

  async getWorkOrderTimeline(id: string) {
    this.findWorkOrder(id);
    return { items: structuredClone(this.snapshot.timeline_events.filter((item) => item.work_order_id === id).sort((a, b) => b.created_at.localeCompare(a.created_at))) };
  }

  async listRecommendations() {
    return { items: structuredClone(this.snapshot.work_orders.flatMap((item) => item.recommendation ? [item.recommendation] : [])) };
  }

  async getRecommendation(id: string) {
    return structuredClone(this.findRecommendation(id).recommendation!);
  }

  async refreshRecommendation(id: string) {
    const workOrder = this.findRecommendation(id);
    const current = workOrder.recommendation!;
    const now = new Date().toISOString();
    const next: Recommendation = {
      ...current,
      status: "ready_for_review",
      delivery_status: "not_copied",
      draft_reply: current.draft_reply || `Hi ${workOrder.tenant?.name.split(" ")[0] ?? "there"}, thanks for the update. We are reviewing ${workOrder.appfolio_id} and will follow up as soon as the next step is confirmed.`,
      failure_reason: undefined,
      safety_flags: current.safety_flags.filter((flag) => flag.code !== "GENERATION_FAILED"),
      version: current.version + 1,
      updated_at: now
    };
    this.replaceRecommendation(workOrder, next);
    this.recordEvent(workOrder, "recommendation_regenerated", "Maya Chen", "Regenerated the AI recommendation for review.", "AI recommendation regenerated");
    return structuredClone(next);
  }

  async editRecommendationDraft(id: string, draft: string) {
    const workOrder = this.findRecommendation(id);
    const current = workOrder.recommendation!;
    if (current.status !== "ready_for_review") throw new ApiError("Only recommendations ready for review can be edited.", 409, "invalid_recommendation_state");
    const next = { ...current, final_edited_reply: draft, version: current.version + 1, updated_at: new Date().toISOString() };
    this.replaceRecommendation(workOrder, next);
    this.recordEvent(workOrder, "draft_edited", "Maya Chen", "Edited the AI draft before approval.", "Draft edited");
    return structuredClone(next);
  }

  async approveRecommendation(id: string, payload: ApproveRecommendationPayload) {
    const workOrder = this.findRecommendation(id);
    const current = workOrder.recommendation!;
    this.assertVersion(current, payload.expected_version);
    if (current.status !== "ready_for_review") throw new ApiError("This recommendation is not ready for approval.", 409, "invalid_recommendation_state");
    const next = { ...current, status: "approved" as const, final_edited_reply: payload.final_reply, approved_reply: payload.final_reply, version: current.version + 1, updated_at: new Date().toISOString() };
    this.replaceRecommendation(workOrder, next);
    this.recordEvent(workOrder, "draft_approved", "Maya Chen", "Approved the final draft for manual delivery.", "Draft approved");
    return structuredClone(next);
  }

  async rejectRecommendation(id: string, payload: RejectRecommendationPayload) {
    const workOrder = this.findRecommendation(id);
    const current = workOrder.recommendation!;
    this.assertVersion(current, payload.expected_version);
    if (current.status !== "ready_for_review") throw new ApiError("This recommendation cannot be rejected in its current state.", 409, "invalid_recommendation_state");
    const next = { ...current, status: "rejected" as const, version: current.version + 1, updated_at: new Date().toISOString() };
    this.replaceRecommendation(workOrder, next);
    this.recordEvent(workOrder, "draft_rejected", "Maya Chen", `Rejected the draft: ${payload.reason}`, "Draft rejected");
    return structuredClone(next);
  }

  async copyApprovedDraft(id: string) {
    const workOrder = this.findRecommendation(id);
    const current = workOrder.recommendation!;
    if (current.status !== "approved" || !current.approved_reply) throw new ApiError("Approve the draft before copying it.", 409, "approval_required");
    const next = { ...current, delivery_status: "copied" as const, updated_at: new Date().toISOString() };
    this.replaceRecommendation(workOrder, next);
    this.recordEvent(workOrder, "draft_copied", "Maya Chen", "Copied the approved draft for manual delivery.", "Approved draft copied");
    return structuredClone(next);
  }

  async markManualSent(id: string, payload: ManualSendPayload) {
    const workOrder = this.findRecommendation(id);
    const current = workOrder.recommendation!;
    if (current.status !== "approved") throw new ApiError("Approve the draft before marking it manually sent.", 409, "approval_required");
    const next = { ...current, delivery_status: "manual_sent" as const, updated_at: new Date().toISOString() };
    this.replaceRecommendation(workOrder, next);
    this.recordEvent(workOrder, "manual_send_marked", "Maya Chen", `Marked the approved draft as manually sent via ${payload.channel}.`, "Marked manually sent");
    return structuredClone(next);
  }

  async listAuditEvents(filters: AuditFilters = {}) {
    let items = [...this.snapshot.audit_events].sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (filters.action && filters.action !== "all") items = items.filter((item) => item.action === filters.action);
    if (filters.query) {
      const query = filters.query.toLowerCase();
      items = items.filter((item) => [item.actor_name, item.work_order_external_id, item.description, item.recommendation_id].some((value) => value?.toLowerCase().includes(query)));
    }
    return { items: structuredClone(items) };
  }

  async listSyncRuns() {
    return { items: structuredClone(this.snapshot.sync_runs) };
  }

  async getIntegrationHealth() {
    return structuredClone(this.snapshot.integration_health);
  }

  async listManualMatchMessages() {
    return { items: structuredClone(this.snapshot.manual_match_messages) };
  }

  async matchInboundMessage(messageId: string, workOrderId: string) {
    const message = this.snapshot.manual_match_messages.find((item) => item.id === messageId);
    if (!message) throw new ApiError("Message not found.", 404, "not_found");
    const workOrder = this.findWorkOrder(workOrderId);
    message.status = "matched";
    message.matched_work_order_id = workOrderId;
    this.recordEvent(workOrder, "manual_match_completed", "Maya Chen", `Matched inbound message ${messageId} to ${workOrder.appfolio_id}.`, "Manual message match completed");
    return structuredClone(message);
  }

  async reset() {
    this.snapshot = createMockSnapshot();
    return this.getSnapshot();
  }

  private findWorkOrder(id: string) {
    const workOrder = this.snapshot.work_orders.find((item) => item.id === id);
    if (!workOrder) throw new ApiError("Work order not found.", 404, "not_found");
    return workOrder;
  }

  private findRecommendation(id: string) {
    const workOrder = this.snapshot.work_orders.find((item) => item.recommendation?.id === id);
    if (!workOrder) throw new ApiError("Recommendation not found.", 404, "not_found");
    return workOrder;
  }

  private replaceRecommendation(workOrder: WorkOrderDetail, next: Recommendation) {
    workOrder.recommendation = next;
    workOrder.recommendation_id = next.id;
    workOrder.recommendation_status = next.status;
    workOrder.updated_at = next.updated_at;
  }

  private assertVersion(recommendation: Recommendation, expected: number) {
    if (recommendation.version !== expected) throw new ApiError("The recommendation changed. Refresh before continuing.", 409, "version_conflict");
  }

  private recordEvent(workOrder: WorkOrderDetail, action: AuditAction, actor: string, description: string, title: string) {
    const now = new Date().toISOString();
    this.snapshot.audit_events.unshift({
      id: `audit-${crypto.randomUUID()}`,
      organization_id: "org-001",
      actor_name: actor,
      action,
      resource_type: action === "manual_match_completed" ? "message" : "recommendation",
      resource_id: workOrder.recommendation?.id ?? workOrder.id,
      work_order_id: workOrder.id,
      work_order_external_id: workOrder.appfolio_id,
      recommendation_id: workOrder.recommendation?.id,
      description,
      excluded_internal_context: workOrder.has_internal_context,
      created_at: now
    });
    this.snapshot.timeline_events.unshift({ id: `timeline-${crypto.randomUUID()}`, work_order_id: workOrder.id, type: action === "manual_match_completed" ? "ai_event" : "approval_event", title, description, actor, created_at: now, is_internal: true });
  }
}
