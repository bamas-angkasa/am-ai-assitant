import type {
  AuditEvent,
  IntegrationHealth,
  MaintenanceSnapshot,
  ManualMatchMessage,
  Recommendation,
  SyncEntityResult,
  SyncRun,
  TimelineEvent,
  WorkOrderDetail,
  WorkOrderNote
} from "@/lib/types/maintenance";

const property = {
  id: "prop-001",
  appfolio_id: "AF-PROP-1200",
  name: "Vantage Residence Apartment",
  address: "1200 Market Street, San Francisco, CA"
};

const units = {
  u101: { id: "unit-101", appfolio_id: "AF-UNIT-101", label: "Unit 101" },
  u203: { id: "unit-203", appfolio_id: "AF-UNIT-203", label: "Unit 203" },
  u305: { id: "unit-305", appfolio_id: "AF-UNIT-305", label: "Unit 305" }
};

const people = {
  john: { id: "tenant-001", name: "John Miller", email: "john.miller@example.com", phone: "+1 415 555 0101" },
  emma: { id: "tenant-002", name: "Emma Carter", email: "emma.carter@example.com", phone: "+1 415 555 0305" },
  daniel: { id: "tenant-003", name: "Daniel Brooks", email: "daniel.brooks@example.com", phone: "+1 415 555 0203" },
  plumbing: { id: "vendor-001", name: "Bay Area Plumbing", email: "dispatch@bayplumbing.example", phone: "+1 415 555 9000" },
  hvac: { id: "vendor-002", name: "Cool Air HVAC", email: "service@coolair.example", phone: "+1 415 555 9100" },
  locks: { id: "vendor-003", name: "SecureLock Services", email: "dispatch@securelock.example", phone: "+1 415 555 9200" }
};

function buildRecommendation(input: Partial<Recommendation> & Pick<Recommendation, "id" | "work_order_id" | "summary" | "detected_intent" | "recommended_action" | "draft_reply">): Recommendation {
  return {
    source_message_id: `msg-${input.work_order_id}`,
    status: "ready_for_review",
    delivery_status: "not_copied",
    audience: "tenant",
    confidence: "high",
    safety_flags: [],
    source_context: [],
    version: 1,
    created_at: "2026-06-29T01:12:00.000Z",
    updated_at: "2026-06-29T01:12:00.000Z",
    ...input
  };
}

function note(id: string, body: string, visibility: WorkOrderNote["visibility"] = "shareable", author = "Maya Chen"): WorkOrderNote {
  return {
    id,
    author,
    body,
    visibility,
    excluded_from_audience_draft: visibility !== "shareable",
    created_at: "2026-06-28T22:15:00.000Z"
  };
}

const workOrders: WorkOrderDetail[] = [
  {
    id: "wo-001", appfolio_id: "WO-10482", title: "Kitchen sink leak", description: "A slow leak below the kitchen sink is dampening the cabinet base.", category: "Plumbing", priority: "high", status: "waiting_vendor",
    property, unit: units.u101, tenant: people.john, vendor: people.plumbing,
    latest_inbound_message: "Do we have an ETA? The cabinet is getting wet.", recommendation_id: "rec-001", recommendation_status: "ready_for_review", is_stale: false, needs_manual_match: false, has_internal_context: true,
    created_at: "2026-06-28T18:20:00.000Z", updated_at: "2026-06-29T01:10:00.000Z", last_appfolio_sync_at: "2026-06-29T01:15:00.000Z",
    appfolio_context: { work_order_external_id: "WO-10482", property_external_id: property.appfolio_id, unit_external_id: units.u101.appfolio_id, source: "appfolio", last_synced_at: "2026-06-29T01:15:00.000Z", sync_status: "healthy", vendor_assigned_at: "2026-06-28T22:00:00.000Z" },
    notes: [note("note-001", "Vendor was assigned and asked to confirm an arrival window."), note("note-002", "# Owner approved emergency spend up to $450. Do not disclose this limit to the resident.", "owner_only", "Dian Property Admin")],
    messages: [{ id: "msg-wo-001", sender: people.john, channel: "appfolio_sms", body: "Do we have an ETA? The cabinet is getting wet and I need to know when someone is coming.", received_at: "2026-06-29T01:10:00.000Z", match_confidence: "high" }],
    attachments: [],
    recommendation: buildRecommendation({
      id: "rec-001", work_order_id: "wo-001", summary: "A high-priority sink leak is waiting for Bay Area Plumbing to confirm an arrival window. The resident is asking for an ETA.", detected_intent: "asking_eta", recommended_action: "Confirm the latest vendor schedule before sharing a specific arrival time.",
      draft_reply: "Hi John, thanks for checking in. Bay Area Plumbing has been assigned to your sink leak, and we are confirming their arrival window now. We will share the timing as soon as the vendor confirms it.", confidence: "medium",
      safety_flags: [{ id: "flag-001", severity: "warning", code: "ETA_UNCONFIRMED", message: "The vendor arrival window has not been confirmed." }, { id: "flag-002", severity: "info", code: "INTERNAL_CONTEXT_EXCLUDED", message: "One owner-only note was excluded from the tenant draft." }],
      source_context: [{ id: "src-001", type: "message", label: "Latest tenant message", excerpt: "Do we have an ETA?", included: true }, { id: "src-002", type: "note", label: "Vendor assignment", excerpt: "Vendor was asked to confirm an arrival window.", included: true }, { id: "src-003", type: "note", label: "Owner-only note", excerpt: "Protected internal context", included: false, exclusion_reason: "Excluded from tenant-facing draft" }]
    })
  },
  {
    id: "wo-002", appfolio_id: "WO-10497", title: "AC not cooling", description: "The air conditioner is running but Unit 305 remains warm.", category: "HVAC", priority: "medium", status: "in_progress",
    property, unit: units.u305, tenant: people.emma, vendor: people.hvac,
    latest_inbound_message: "Any update on the AC? It has been warm since last night.", recommendation_id: "rec-002", recommendation_status: "ready_for_review", is_stale: false, needs_manual_match: false, has_internal_context: false,
    created_at: "2026-06-28T20:40:00.000Z", updated_at: "2026-06-29T00:42:00.000Z", last_appfolio_sync_at: "2026-06-29T01:15:00.000Z",
    appfolio_context: { work_order_external_id: "WO-10497", property_external_id: property.appfolio_id, unit_external_id: units.u305.appfolio_id, source: "appfolio", last_synced_at: "2026-06-29T01:15:00.000Z", sync_status: "healthy", vendor_assigned_at: "2026-06-28T23:10:00.000Z", scheduled_at: "2026-06-29T17:00:00.000Z" },
    notes: [note("note-003", "Thermostat checked. Cool Air HVAC is scheduled for the afternoon window.", "shareable", "Luis Romero")],
    messages: [{ id: "msg-wo-002", sender: people.emma, channel: "appfolio_email", body: "Any update on the AC? It has been warm since last night.", received_at: "2026-06-29T00:42:00.000Z", match_confidence: "high" }], attachments: [],
    recommendation: buildRecommendation({ id: "rec-002", work_order_id: "wo-002", summary: "Cool Air HVAC is scheduled this afternoon after maintenance confirmed the thermostat is functioning.", detected_intent: "requesting_update", recommended_action: "Share the confirmed service window and ask the resident to keep the unit accessible.", draft_reply: "Hi Emma, Cool Air HVAC is scheduled to inspect the AC this afternoon. Please keep the unit accessible, and we will update you after the technician's visit.", source_context: [{ id: "src-004", type: "note", label: "Maintenance note", excerpt: "Cool Air HVAC is scheduled for the afternoon.", included: true }] })
  },
  {
    id: "wo-003", appfolio_id: "WO-10503", title: "Bedroom lock not working", description: "The bedroom lock turns but does not latch consistently.", category: "Locks & Access", priority: "high", status: "waiting_tenant",
    property, unit: units.u203, tenant: people.daniel, vendor: people.locks,
    latest_inbound_message: "Tomorrow between 10 and noon works for me.", recommendation_id: "rec-003", recommendation_status: "approved", is_stale: false, needs_manual_match: false, has_internal_context: false,
    created_at: "2026-06-27T15:10:00.000Z", updated_at: "2026-06-29T00:10:00.000Z", last_appfolio_sync_at: "2026-06-29T01:15:00.000Z",
    appfolio_context: { work_order_external_id: "WO-10503", property_external_id: property.appfolio_id, unit_external_id: units.u203.appfolio_id, source: "appfolio", last_synced_at: "2026-06-29T01:15:00.000Z", sync_status: "healthy", scheduled_at: "2026-06-30T17:00:00.000Z" },
    notes: [note("note-004", "SecureLock Services offered tomorrow from 10:00 AM to noon.")],
    messages: [{ id: "msg-wo-003", sender: people.daniel, channel: "appfolio_sms", body: "Tomorrow between 10 and noon works for me.", received_at: "2026-06-29T00:10:00.000Z", match_confidence: "high" }], attachments: [],
    recommendation: buildRecommendation({ id: "rec-003", work_order_id: "wo-003", status: "approved", delivery_status: "copied", summary: "The resident accepted SecureLock Services' proposed appointment window.", detected_intent: "confirming_schedule", recommended_action: "Confirm the accepted appointment window with both parties.", draft_reply: "Hi Daniel, your appointment with SecureLock Services is confirmed for tomorrow between 10:00 AM and noon. Thank you for confirming your availability.", final_edited_reply: "Hi Daniel, your appointment with SecureLock Services is confirmed for tomorrow between 10:00 AM and noon. Thank you for confirming your availability.", approved_reply: "Hi Daniel, your appointment with SecureLock Services is confirmed for tomorrow between 10:00 AM and noon. Thank you for confirming your availability.", version: 2, source_context: [{ id: "src-006", type: "message", label: "Tenant confirmation", excerpt: "Tomorrow between 10 and noon works for me.", included: true }] })
  },
  {
    id: "wo-004", appfolio_id: "WO-10511", title: "Active water intrusion", description: "Water is entering through the ceiling near the living room light fixture.", category: "Emergency Plumbing", priority: "urgent", status: "open",
    property, unit: units.u305, tenant: people.emma, vendor: people.plumbing,
    latest_inbound_message: "Water is coming through the ceiling next to the light.", recommendation_id: "rec-004", recommendation_status: "ready_for_review", is_stale: false, needs_manual_match: false, has_internal_context: true,
    created_at: "2026-06-29T01:01:00.000Z", updated_at: "2026-06-29T01:08:00.000Z", last_appfolio_sync_at: "2026-06-29T01:15:00.000Z",
    appfolio_context: { work_order_external_id: "WO-10511", property_external_id: property.appfolio_id, unit_external_id: units.u305.appfolio_id, source: "appfolio", last_synced_at: "2026-06-29T01:15:00.000Z", sync_status: "healthy" },
    notes: [note("note-005", "# Escalated to on-call manager and building engineer.", "internal", "Dian Property Admin")],
    messages: [{ id: "msg-wo-004", sender: people.emma, channel: "appfolio_sms", body: "Water is coming through the ceiling next to the light. It is getting worse.", received_at: "2026-06-29T01:08:00.000Z", match_confidence: "high" }],
    attachments: [{ id: "att-001", name: "ceiling-water.jpg", content_type: "image/jpeg", created_at: "2026-06-29T01:08:00.000Z" }],
    recommendation: buildRecommendation({ id: "rec-004", work_order_id: "wo-004", summary: "Urgent water intrusion is occurring near an electrical fixture and requires immediate human escalation.", detected_intent: "urgency_escalation", recommended_action: "Call the resident and emergency vendor immediately; advise the resident to avoid the affected area.", draft_reply: "Hi Emma, we have escalated this as an emergency. Please stay away from the affected ceiling and light fixture. Our on-call team is reviewing the situation now and will contact you directly with the next step.", safety_flags: [{ id: "flag-003", severity: "critical", code: "ACTIVE_WATER_ELECTRICAL_RISK", message: "Active water near an electrical fixture requires immediate human escalation." }, { id: "flag-004", severity: "info", code: "INTERNAL_CONTEXT_EXCLUDED", message: "Internal escalation notes were excluded from the resident draft." }], source_context: [{ id: "src-008", type: "message", label: "Urgent resident report", excerpt: "Water is coming through the ceiling next to the light.", included: true }, { id: "src-009", type: "note", label: "Internal escalation", excerpt: "Protected internal context", included: false, exclusion_reason: "Internal-only note" }] })
  },
  {
    id: "wo-005", appfolio_id: "WO-10431", title: "Bathroom exhaust fan noisy", description: "The exhaust fan rattles loudly while running.", category: "Electrical", priority: "low", status: "waiting_vendor",
    property, unit: units.u203, tenant: people.daniel,
    latest_inbound_message: "Has a technician been assigned yet?", recommendation_id: "rec-005", recommendation_status: "ready_for_review", is_stale: true, needs_manual_match: false, has_internal_context: false,
    created_at: "2026-06-22T12:00:00.000Z", updated_at: "2026-06-25T17:30:00.000Z", last_appfolio_sync_at: "2026-06-29T01:15:00.000Z",
    appfolio_context: { work_order_external_id: "WO-10431", property_external_id: property.appfolio_id, unit_external_id: units.u203.appfolio_id, source: "appfolio", last_synced_at: "2026-06-29T01:15:00.000Z", sync_status: "healthy" },
    notes: [note("note-006", "Vendor outreach sent; no response after three business days.")],
    messages: [{ id: "msg-wo-005", sender: people.daniel, channel: "appfolio_email", body: "Has a technician been assigned yet?", received_at: "2026-06-29T00:20:00.000Z", match_confidence: "high" }], attachments: [],
    recommendation: buildRecommendation({ id: "rec-005", work_order_id: "wo-005", summary: "Vendor assignment is overdue and the resident is asking for an update.", detected_intent: "vendor_follow_up", recommended_action: "Follow up with the vendor or assign an alternative before promising a service date.", draft_reply: "Hi Daniel, we are following up on the technician assignment for your exhaust fan and will update you once the appointment is confirmed.", confidence: "medium", safety_flags: [{ id: "flag-005", severity: "warning", code: "STALE_VENDOR_RESPONSE", message: "No vendor response has been recorded for three business days." }] })
  },
  {
    id: "wo-006", appfolio_id: "WO-10507", title: "Dishwasher not draining", description: "The dishwasher retains standing water after a cycle.", category: "Appliance", priority: "medium", status: "open",
    property, unit: units.u101, tenant: people.john,
    latest_inbound_message: "The dishwasher still has water in it.", recommendation_id: "rec-006", recommendation_status: "failed", is_stale: false, needs_manual_match: false, has_internal_context: false,
    created_at: "2026-06-28T11:00:00.000Z", updated_at: "2026-06-29T00:32:00.000Z", last_appfolio_sync_at: "2026-06-29T01:15:00.000Z",
    appfolio_context: { work_order_external_id: "WO-10507", property_external_id: property.appfolio_id, unit_external_id: units.u101.appfolio_id, source: "appfolio", last_synced_at: "2026-06-29T01:15:00.000Z", sync_status: "healthy" },
    notes: [], messages: [{ id: "msg-wo-006", sender: people.john, channel: "appfolio_sms", body: "The dishwasher still has water in it.", received_at: "2026-06-29T00:32:00.000Z", match_confidence: "high" }], attachments: [],
    recommendation: buildRecommendation({ id: "rec-006", work_order_id: "wo-006", status: "failed", summary: "Recommendation generation did not complete.", detected_intent: "requesting_update", recommended_action: "Regenerate after confirming the AI service is available.", draft_reply: "", confidence: "low", failure_reason: "The AI provider returned an invalid structured response.", safety_flags: [{ id: "flag-006", severity: "warning", code: "GENERATION_FAILED", message: "No draft is available until the recommendation is regenerated." }] })
  }
];

const timelineEvents: TimelineEvent[] = workOrders.flatMap((workOrder) => [
  ...workOrder.messages.map((message) => ({ id: `timeline-${message.id}`, work_order_id: workOrder.id, type: "inbound_message" as const, title: `Inbound ${message.channel.includes("sms") ? "SMS" : "email"}`, description: message.body, actor: message.sender.name, created_at: message.received_at, is_internal: false })),
  ...workOrder.notes.map((item) => ({ id: `timeline-${item.id}`, work_order_id: workOrder.id, type: item.visibility === "shareable" ? ("shareable_note" as const) : ("internal_note" as const), title: item.visibility === "shareable" ? "Work order note" : "Internal / owner-only note", description: item.body, actor: item.author, created_at: item.created_at, is_internal: item.visibility !== "shareable" })),
  { id: `timeline-sync-${workOrder.id}`, work_order_id: workOrder.id, type: "sync_event" as const, title: "Synced from AppFolio", description: "Work order context was refreshed successfully.", actor: "AppFolio Sync", created_at: workOrder.last_appfolio_sync_at, is_internal: true }
]);

const auditEvents: AuditEvent[] = [
  { id: "audit-001", organization_id: "org-001", actor_name: "AI Worker", action: "recommendation_generated", resource_type: "recommendation", resource_id: "rec-001", work_order_id: "wo-001", work_order_external_id: "WO-10482", recommendation_id: "rec-001", description: "Generated a tenant update draft using shareable work-order context.", excluded_internal_context: true, created_at: "2026-06-29T01:12:00.000Z" },
  { id: "audit-002", organization_id: "org-001", actor_name: "Maya Chen", action: "draft_approved", resource_type: "recommendation", resource_id: "rec-003", work_order_id: "wo-003", work_order_external_id: "WO-10503", recommendation_id: "rec-003", description: "Approved the schedule confirmation draft.", before_summary: "Ready for review", after_summary: "Approved", excluded_internal_context: false, created_at: "2026-06-29T00:15:00.000Z" },
  { id: "audit-003", organization_id: "org-001", actor_name: "Maya Chen", action: "draft_copied", resource_type: "recommendation", resource_id: "rec-003", work_order_id: "wo-003", work_order_external_id: "WO-10503", recommendation_id: "rec-003", description: "Copied the approved draft for manual delivery.", excluded_internal_context: false, created_at: "2026-06-29T00:16:00.000Z" },
  { id: "audit-004", organization_id: "org-001", actor_name: "AppFolio Sync", action: "work_order_synced", resource_type: "work_order", resource_id: "wo-004", work_order_id: "wo-004", work_order_external_id: "WO-10511", description: "Synced urgent water-intrusion report.", excluded_internal_context: false, created_at: "2026-06-29T01:15:00.000Z" },
  { id: "audit-005", organization_id: "org-001", actor_name: "AI Worker", action: "recommendation_generated", resource_type: "recommendation", resource_id: "rec-006", work_order_id: "wo-006", work_order_external_id: "WO-10507", recommendation_id: "rec-006", description: "Recommendation generation failed structured-output validation.", excluded_internal_context: false, created_at: "2026-06-29T00:34:00.000Z" }
];

const manualMatchMessages: ManualMatchMessage[] = [{
  id: "unmatched-001", sender: { id: "unknown-001", name: "Unknown resident", phone: "+1 415 555 0177" }, channel: "fallback_sms", body: "The leak by the bedroom window is back and the carpet is wet again.", received_at: "2026-06-29T00:55:00.000Z", confidence_score: 0.42, status: "needs_review",
  suggestions: [{ work_order_id: "wo-004", work_order_external_id: "WO-10511", title: "Active water intrusion", property_unit: "Vantage Residence · Unit 305", score: 0.42 }, { work_order_id: "wo-001", work_order_external_id: "WO-10482", title: "Kitchen sink leak", property_unit: "Vantage Residence · Unit 101", score: 0.27 }]
}];

const entityRows: Array<[SyncEntityResult["entity"], number, number]> = [["work_orders", 148, 0], ["work_order_notes", 392, 0], ["tenants", 214, 0], ["vendors", 47, 0], ["owners", 81, 0], ["properties", 12, 0], ["units", 186, 0], ["inbound_messages", 96, 1], ["attachments", 31, 0]];
const syncEntities: SyncEntityResult[] = entityRows.map(([entity, processed, failed]) => ({ entity, status: failed ? "partial" : "healthy", processed, failed, last_synced_at: "2026-06-29T01:15:00.000Z" }));
const syncRuns: SyncRun[] = [
  { id: "sync-003", status: "healthy", started_at: "2026-06-29T01:14:42.000Z", completed_at: "2026-06-29T01:15:00.000Z", duration_ms: 18000, records_processed: 1207, records_failed: 0, entities: syncEntities },
  { id: "sync-002", status: "partial", started_at: "2026-06-29T01:09:42.000Z", completed_at: "2026-06-29T01:10:04.000Z", duration_ms: 22000, records_processed: 1189, records_failed: 1, entities: syncEntities, error_summary: "One inbound message was deferred for retry." },
  { id: "sync-001", status: "healthy", started_at: "2026-06-29T01:04:43.000Z", completed_at: "2026-06-29T01:05:00.000Z", duration_ms: 17000, records_processed: 1186, records_failed: 0, entities: syncEntities }
];

const integrationHealth: IntegrationHealth = { appfolio_status: "healthy", last_successful_sync_at: "2026-06-29T01:15:00.000Z", last_sync_duration_ms: 18000, records_processed: 1207, records_failed: 0, queue_depth: 3, ai_failure_count: 1, dead_letter_count: 0, rate_limit_remaining: 872, rate_limit_total: 1000 };

export function createMockSnapshot(): MaintenanceSnapshot {
  return structuredClone({ work_orders: workOrders, timeline_events: timelineEvents, audit_events: auditEvents, manual_match_messages: manualMatchMessages, sync_runs: syncRuns, integration_health: integrationHealth });
}
