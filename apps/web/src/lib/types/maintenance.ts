export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";
export type WorkOrderStatus = "open" | "in_progress" | "waiting_vendor" | "waiting_tenant" | "resolved" | "closed";
export type RecommendationStatus = "queued" | "processing" | "ready_for_review" | "approved" | "rejected" | "failed";
export type RecommendationIntent =
  | "asking_eta"
  | "reporting_new_issue"
  | "requesting_update"
  | "confirming_schedule"
  | "cost_approval"
  | "vendor_follow_up"
  | "urgency_escalation"
  | "general_update";
export type RecommendationAudience = "tenant" | "vendor" | "owner" | "internal";
export type ConfidenceLevel = "low" | "medium" | "high";
export type DeliveryStatus = "not_copied" | "copied" | "manual_sent";
export type SyncStatus = "healthy" | "running" | "partial" | "failed";

export interface ContactSummary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface PropertySummary {
  id: string;
  appfolio_id: string;
  name: string;
  address: string;
}

export interface UnitSummary {
  id: string;
  appfolio_id: string;
  label: string;
}

export interface WorkOrder {
  id: string;
  appfolio_id: string;
  title: string;
  description: string;
  category: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  property: PropertySummary;
  unit?: UnitSummary;
  tenant?: ContactSummary;
  vendor?: ContactSummary;
  latest_inbound_message?: string;
  recommendation_id?: string;
  recommendation_status?: RecommendationStatus;
  is_stale: boolean;
  needs_manual_match: boolean;
  has_internal_context: boolean;
  created_at: string;
  updated_at: string;
  last_appfolio_sync_at: string;
}

export interface AppFolioContext {
  work_order_external_id: string;
  property_external_id: string;
  unit_external_id?: string;
  source: "appfolio";
  last_synced_at: string;
  sync_status: SyncStatus;
  vendor_assigned_at?: string;
  scheduled_at?: string;
}

export interface WorkOrderNote {
  id: string;
  author: string;
  body: string;
  visibility: "shareable" | "internal" | "owner_only";
  excluded_from_audience_draft: boolean;
  created_at: string;
}

export interface InboundMessage {
  id: string;
  sender: ContactSummary;
  channel: "appfolio_email" | "appfolio_sms" | "fallback_email" | "fallback_sms";
  body: string;
  received_at: string;
  match_confidence: ConfidenceLevel;
}

export interface WorkOrderAttachment {
  id: string;
  name: string;
  content_type: string;
  source_url?: string;
  created_at: string;
}

export interface SourceContext {
  id: string;
  type: "work_order" | "message" | "note" | "vendor" | "property";
  label: string;
  excerpt: string;
  included: boolean;
  exclusion_reason?: string;
}

export interface SafetyFlag {
  id: string;
  severity: "info" | "warning" | "critical";
  code: string;
  message: string;
}

export interface Recommendation {
  id: string;
  work_order_id: string;
  source_message_id?: string;
  status: RecommendationStatus;
  delivery_status: DeliveryStatus;
  summary: string;
  detected_intent: RecommendationIntent;
  recommended_action: string;
  audience: RecommendationAudience;
  draft_reply: string;
  final_edited_reply?: string;
  approved_reply?: string;
  confidence: ConfidenceLevel;
  safety_flags: SafetyFlag[];
  source_context: SourceContext[];
  failure_reason?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  work_order_id: string;
  type: "inbound_message" | "shareable_note" | "internal_note" | "status_change" | "ai_event" | "approval_event" | "sync_event";
  title: string;
  description: string;
  actor?: string;
  created_at: string;
  is_internal: boolean;
}

export interface WorkOrderDetail extends WorkOrder {
  appfolio_context: AppFolioContext;
  notes: WorkOrderNote[];
  messages: InboundMessage[];
  attachments: WorkOrderAttachment[];
  recommendation?: Recommendation;
}

export type AuditAction =
  | "recommendation_generated"
  | "draft_edited"
  | "draft_approved"
  | "draft_rejected"
  | "draft_copied"
  | "manual_send_marked"
  | "recommendation_regenerated"
  | "manual_match_completed"
  | "work_order_synced";

export interface AuditEvent {
  id: string;
  organization_id: string;
  actor_name: string;
  action: AuditAction;
  resource_type: "work_order" | "recommendation" | "message" | "sync_run";
  resource_id: string;
  work_order_id?: string;
  work_order_external_id?: string;
  recommendation_id?: string;
  description: string;
  before_summary?: string;
  after_summary?: string;
  excluded_internal_context: boolean;
  created_at: string;
}

export interface SuggestedWorkOrderMatch {
  work_order_id: string;
  work_order_external_id: string;
  title: string;
  property_unit: string;
  score: number;
}

export interface ManualMatchMessage {
  id: string;
  sender: ContactSummary;
  channel: InboundMessage["channel"];
  body: string;
  received_at: string;
  confidence_score: number;
  status: "needs_review" | "matched";
  suggestions: SuggestedWorkOrderMatch[];
  matched_work_order_id?: string;
}

export interface SyncEntityResult {
  entity: "work_orders" | "work_order_notes" | "tenants" | "vendors" | "owners" | "properties" | "units" | "inbound_messages" | "attachments";
  status: SyncStatus;
  processed: number;
  failed: number;
  last_synced_at: string;
}

export interface SyncRun {
  id: string;
  status: SyncStatus;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  records_processed: number;
  records_failed: number;
  entities: SyncEntityResult[];
  error_summary?: string;
}

export interface IntegrationHealth {
  appfolio_status: SyncStatus;
  last_successful_sync_at: string;
  last_sync_duration_ms: number;
  records_processed: number;
  records_failed: number;
  queue_depth: number;
  ai_failure_count: number;
  dead_letter_count: number;
  rate_limit_remaining: number;
  rate_limit_total: number;
}

export interface WorkOrderFilters {
  query?: string;
  view?: "all" | "ready_for_review" | "needs_manual_matching" | "urgent" | "waiting_vendor" | "waiting_tenant" | "stale" | "failed_ai" | "recently_approved";
}

export interface AuditFilters {
  query?: string;
  action?: AuditAction | "all";
}

export interface ListResult<T> {
  items: T[];
  next_cursor?: string;
}

export interface ApproveRecommendationPayload {
  final_reply: string;
  expected_version: number;
}

export interface RejectRecommendationPayload {
  reason: string;
  expected_version: number;
}

export interface ManualSendPayload {
  channel: "appfolio" | "email" | "sms" | "other";
}

export interface MaintenanceSnapshot {
  work_orders: WorkOrderDetail[];
  timeline_events: TimelineEvent[];
  audit_events: AuditEvent[];
  manual_match_messages: ManualMatchMessage[];
  sync_runs: SyncRun[];
  integration_health: IntegrationHealth;
}
