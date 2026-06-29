import { apiEndpoints } from "@/lib/api/endpoint-map";
import { ApiError, type MaintenanceApi } from "@/lib/api/maintenance-api";
import type { ApproveRecommendationPayload, AuditFilters, HealthStatus, IntegrationHealth, ListResult, ManualMatchMessage, ManualSendPayload, Recommendation, RejectRecommendationPayload, SyncRun, TimelineEvent, WorkOrder, WorkOrderDetail, WorkOrderFilters, AuditEvent } from "@/lib/types/maintenance";

export class FetchMaintenanceApi implements MaintenanceApi {
  constructor(private readonly baseUrl = "") {}

  getHealth() { return this.request<HealthStatus>(apiEndpoints.health); }
  listWorkOrders(filters: WorkOrderFilters = {}) { return this.request<ListResult<WorkOrder>>(`${apiEndpoints.workOrders}${queryString(filters)}`); }
  getWorkOrder(id: string) { return this.request<WorkOrderDetail>(apiEndpoints.workOrder(id)); }
  getWorkOrderTimeline(id: string) { return this.request<ListResult<TimelineEvent>>(apiEndpoints.workOrderTimeline(id)); }
  listRecommendations() { return this.request<ListResult<Recommendation>>(apiEndpoints.recommendations); }
  getRecommendation(id: string) { return this.request<Recommendation>(apiEndpoints.recommendation(id)); }
  refreshRecommendation(id: string) { return this.request<Recommendation>(apiEndpoints.refreshRecommendation(id), { method: "POST" }); }
  editRecommendationDraft(id: string, draft: string) { return this.request<Recommendation>(apiEndpoints.editRecommendationDraft(id), { method: "PATCH", body: JSON.stringify({ draft_reply: draft }) }); }
  approveRecommendation(id: string, payload: ApproveRecommendationPayload) { return this.request<Recommendation>(apiEndpoints.approveRecommendation(id), { method: "POST", body: JSON.stringify(payload) }); }
  rejectRecommendation(id: string, payload: RejectRecommendationPayload) { return this.request<Recommendation>(apiEndpoints.rejectRecommendation(id), { method: "POST", body: JSON.stringify(payload) }); }
  copyApprovedDraft(id: string) { return this.request<Recommendation>(apiEndpoints.copyRecommendation(id), { method: "POST" }); }
  markManualSent(id: string, payload: ManualSendPayload) { return this.request<Recommendation>(apiEndpoints.markManualSent(id), { method: "POST", body: JSON.stringify(payload) }); }
  listAuditEvents(filters: AuditFilters = {}) { return this.request<ListResult<AuditEvent>>(`${apiEndpoints.auditEvents}${queryString(filters)}`); }
  listSyncRuns() { return this.request<ListResult<SyncRun>>(apiEndpoints.syncRuns); }
  getIntegrationHealth() { return this.request<IntegrationHealth>(apiEndpoints.integrationHealth); }
  listManualMatchMessages() { return this.request<ListResult<ManualMatchMessage>>(apiEndpoints.unmatchedMessages); }
  matchInboundMessage(messageId: string, workOrderId: string) { return this.request<ManualMatchMessage>(apiEndpoints.matchMessage(messageId), { method: "POST", body: JSON.stringify({ work_order_id: workOrderId }) }); }

  private async request<T>(path: string, init: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, { credentials: "include", headers: { "Content-Type": "application/json", ...init.headers }, ...init });
    if (!response.ok) {
      const problem = await response.json().catch(() => null) as { detail?: string; code?: string } | null;
      throw new ApiError(problem?.detail ?? "The API request failed.", response.status, problem?.code ?? "request_failed");
    }
    return response.json() as Promise<T>;
  }
}

function queryString<T extends object>(values: T) {
  const params = new URLSearchParams();
  Object.entries(values as Record<string, unknown>).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  const query = params.toString();
  return query ? `?${query}` : "";
}
