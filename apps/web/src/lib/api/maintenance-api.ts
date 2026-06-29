import type {
  ApproveRecommendationPayload,
  AuditEvent,
  AuditFilters,
  IntegrationHealth,
  ListResult,
  MaintenanceSnapshot,
  ManualMatchMessage,
  ManualSendPayload,
  Recommendation,
  RejectRecommendationPayload,
  SyncRun,
  TimelineEvent,
  WorkOrder,
  WorkOrderDetail,
  WorkOrderFilters
} from "@/lib/types/maintenance";

export interface MaintenanceApi {
  getSnapshot(): MaintenanceSnapshot;
  listWorkOrders(filters?: WorkOrderFilters): Promise<ListResult<WorkOrder>>;
  getWorkOrder(id: string): Promise<WorkOrderDetail>;
  getWorkOrderTimeline(id: string): Promise<ListResult<TimelineEvent>>;
  listRecommendations(): Promise<ListResult<Recommendation>>;
  getRecommendation(id: string): Promise<Recommendation>;
  refreshRecommendation(id: string): Promise<Recommendation>;
  editRecommendationDraft(id: string, draft: string): Promise<Recommendation>;
  approveRecommendation(id: string, payload: ApproveRecommendationPayload): Promise<Recommendation>;
  rejectRecommendation(id: string, payload: RejectRecommendationPayload): Promise<Recommendation>;
  copyApprovedDraft(id: string): Promise<Recommendation>;
  markManualSent(id: string, payload: ManualSendPayload): Promise<Recommendation>;
  listAuditEvents(filters?: AuditFilters): Promise<ListResult<AuditEvent>>;
  listSyncRuns(): Promise<ListResult<SyncRun>>;
  getIntegrationHealth(): Promise<IntegrationHealth>;
  listManualMatchMessages(): Promise<ListResult<ManualMatchMessage>>;
  matchInboundMessage(messageId: string, workOrderId: string): Promise<ManualMatchMessage>;
  reset(): Promise<MaintenanceSnapshot>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message);
  }
}
