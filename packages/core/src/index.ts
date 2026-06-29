export type MessageChannel = "appfolio_email" | "appfolio_sms" | "appfolio_note" | "fallback_email" | "fallback_sms";
export type WorkOrderStatus = "open" | "in_progress" | "waiting_vendor" | "waiting_tenant" | "resolved" | "closed";
export type RecommendationStatus = "queued" | "processing" | "ready_for_review" | "approved" | "rejected" | "copied" | "manual_send_marked" | "failed";
export type RecommendationIntent =
  | "asking_eta"
  | "reporting_new_issue"
  | "requesting_update"
  | "confirming_schedule"
  | "cost_approval"
  | "vendor_follow_up"
  | "urgency_escalation"
  | "general_update";

export interface MaintenanceUser {
  id: string;
  name: string;
  role: "admin" | "property_manager" | "maintenance_staff";
}

export interface MaintenanceContact {
  id: string;
  name: string;
  type: "tenant" | "vendor" | "owner" | "internal";
  email?: string;
  phone?: string;
}

export interface MaintenanceProperty {
  id: string;
  appfolioId: string;
  name: string;
  address: string;
}

export interface MaintenanceUnit {
  id: string;
  appfolioId: string;
  propertyId: string;
  label: string;
}

export interface WorkOrderNote {
  id: string;
  workOrderId: string;
  body: string;
  author: string;
  createdAt: string;
  isInternalOnly: boolean;
}

export interface InboundMessage {
  id: string;
  workOrderId: string;
  channel: MessageChannel;
  senderContactId: string;
  body: string;
  receivedAt: string;
  matchConfidence: "low" | "medium" | "high";
}

export interface MaintenanceWorkOrder {
  id: string;
  appfolioId: string;
  title: string;
  description: string;
  propertyId: string;
  unitId?: string;
  tenantContactId?: string;
  vendorContactId?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: WorkOrderStatus;
  lastAppfolioUpdatedAt: string;
  createdAt: string;
}

export interface AiRecommendation {
  id: string;
  workOrderId: string;
  sourceMessageId?: string;
  status: RecommendationStatus;
  summary: string;
  detectedIntent: RecommendationIntent;
  recommendedAction: string;
  audience: "tenant" | "vendor" | "owner" | "internal";
  draftReply: string;
  finalEditedReply?: string;
  excludedInternalContext: boolean;
  safetyFlags: string[];
  confidence: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  workOrderId: string;
  recommendationId?: string;
  actor: string;
  action: "synced" | "recommended" | "edited" | "approved" | "rejected" | "copied" | "manual_send_marked";
  description: string;
  createdAt: string;
}

export interface MaintenanceDataSet {
  users: MaintenanceUser[];
  properties: MaintenanceProperty[];
  units: MaintenanceUnit[];
  contacts: MaintenanceContact[];
  workOrders: MaintenanceWorkOrder[];
  notes: WorkOrderNote[];
  messages: InboundMessage[];
  recommendations: AiRecommendation[];
  auditEvents: AuditEvent[];
}

export function isOwnerOnlyNote(body: string) {
  return body.trim().startsWith("#") || /\s#owner-only\b/i.test(body) || /\s#internal\b/i.test(body);
}

export function detectMaintenanceIntent(message: string): RecommendationIntent {
  const text = message.toLowerCase();
  if (/(flood|fire|gas leak|electrical danger|sparking|urgent|emergency)/.test(text)) return "urgency_escalation";
  if (/(when|eta|arrival|arrive|coming|schedule|scheduled)/.test(text)) return "asking_eta";
  if (/(approve|approval|cost|estimate|invoice|charge)/.test(text)) return "cost_approval";
  if (/(confirmed|confirm|works for me|appointment)/.test(text)) return "confirming_schedule";
  if (/(new issue|also|another|now|started)/.test(text)) return "reporting_new_issue";
  if (/(vendor|technician|contractor|follow up|no update)/.test(text)) return "vendor_follow_up";
  if (/(status|update|what is happening|progress)/.test(text)) return "requesting_update";
  return "general_update";
}

export function buildRecommendation(data: MaintenanceDataSet, workOrderId: string): AiRecommendation {
  const workOrder = data.workOrders.find((item) => item.id === workOrderId);
  if (!workOrder) throw new Error(`Unknown work order: ${workOrderId}`);

  const notes = data.notes.filter((note) => note.workOrderId === workOrderId);
  const messages = data.messages.filter((message) => message.workOrderId === workOrderId);
  const latestMessage = messages.at(-1);
  const visibleNotes = notes.filter((note) => !note.isInternalOnly);
  const internalNotes = notes.filter((note) => note.isInternalOnly);
  const intent = detectMaintenanceIntent(latestMessage?.body ?? workOrder.description);
  const property = data.properties.find((item) => item.id === workOrder.propertyId);
  const unit = data.units.find((item) => item.id === workOrder.unitId);

  const summaryParts = [
    `${workOrder.title} is ${workOrder.status.replaceAll("_", " ")} with ${workOrder.priority} priority.`,
    property ? `Property: ${property.name}${unit ? `, ${unit.label}` : ""}.` : undefined,
    visibleNotes.at(-1) ? `Latest shareable note: ${visibleNotes.at(-1)?.body}` : undefined,
    latestMessage ? `Latest inbound message: ${latestMessage.body}` : undefined
  ].filter(Boolean);

  const safetyFlags = [
    internalNotes.length > 0 ? `${internalNotes.length} internal/owner-only note(s) excluded from the draft.` : undefined,
    intent === "urgency_escalation" ? "Urgent issue detected. Manager should verify emergency handling before replying." : undefined,
    intent === "cost_approval" ? "Cost approval detected. Draft must not approve cost unless source data supports it." : undefined
  ].filter(Boolean) as string[];

  return {
    id: `rec-${workOrder.id}`,
    workOrderId,
    sourceMessageId: latestMessage?.id,
    status: "ready_for_review",
    summary: summaryParts.join(" "),
    detectedIntent: intent,
    recommendedAction: getRecommendedAction(intent, workOrder.status),
    audience: inferAudience(latestMessage?.channel),
    draftReply: buildDraftReply(intent, workOrder, visibleNotes.at(-1)?.body),
    excludedInternalContext: internalNotes.length > 0,
    safetyFlags,
    confidence: latestMessage?.matchConfidence === "low" ? "low" : safetyFlags.length > 0 ? "medium" : "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function inferAudience(channel?: MessageChannel): AiRecommendation["audience"] {
  if (!channel) return "tenant";
  if (channel.includes("note")) return "internal";
  return "tenant";
}

function getRecommendedAction(intent: RecommendationIntent, status: WorkOrderStatus) {
  if (intent === "urgency_escalation") return "Escalate internally, verify emergency handling, then send a careful update.";
  if (intent === "asking_eta") return "Confirm the latest vendor scheduling detail before replying with an ETA.";
  if (intent === "vendor_follow_up" || status === "waiting_vendor") return "Follow up with the vendor and update the resident after confirmation.";
  if (intent === "cost_approval") return "Route cost approval to the manager/owner workflow before sharing a decision.";
  return "Send a concise status update based on the latest shareable work order context.";
}

function buildDraftReply(intent: RecommendationIntent, workOrder: MaintenanceWorkOrder, latestShareableNote?: string) {
  const contextLine = latestShareableNote ? ` The latest update we have is: ${latestShareableNote}` : "";
  if (intent === "asking_eta") {
    return `Thanks for checking in. We are reviewing the current schedule for work order ${workOrder.appfolioId}.${contextLine} We will confirm the timing and follow up shortly.`;
  }
  if (intent === "urgency_escalation") {
    return `Thank you for letting us know. This sounds urgent, so we are escalating work order ${workOrder.appfolioId} for immediate review. If there is active danger, please contact emergency services right away.`;
  }
  if (intent === "cost_approval") {
    return `Thanks for the update. We are reviewing the cost details for work order ${workOrder.appfolioId} and will confirm the next step once approval is complete.`;
  }
  return `Thanks for the update. We have work order ${workOrder.appfolioId} on file and it is currently ${workOrder.status.replaceAll("_", " ")}.${contextLine} We will follow up when there is a new update.`;
}

export const demoMaintenanceData: MaintenanceDataSet = {
  users: [
    { id: "usr-001", name: "Dian Property Admin", role: "admin" },
    { id: "usr-002", name: "Maya Chen", role: "property_manager" },
    { id: "usr-003", name: "Luis Romero", role: "maintenance_staff" }
  ],
  properties: [
    { id: "prop-001", appfolioId: "AF-PROP-1200", name: "Vantage Residence Apartment", address: "1200 Market Street, San Francisco, CA" }
  ],
  units: [
    { id: "unit-101", appfolioId: "AF-UNIT-101", propertyId: "prop-001", label: "Unit 101" },
    { id: "unit-204", appfolioId: "AF-UNIT-204", propertyId: "prop-001", label: "Unit 204" }
  ],
  contacts: [
    { id: "tenant-001", name: "John Miller", type: "tenant", email: "john@example.com", phone: "+14155550101" },
    { id: "tenant-002", name: "Alicia Park", type: "tenant", email: "alicia@example.com", phone: "+14155550204" },
    { id: "vendor-001", name: "Bay Area Plumbing", type: "vendor", email: "dispatch@bayplumbing.example", phone: "+14155559000" },
    { id: "owner-001", name: "Paul Anderson", type: "owner", email: "paul@example.com" }
  ],
  workOrders: [
    {
      id: "wo-001",
      appfolioId: "WO-10482",
      title: "Kitchen sink leak",
      description: "Tenant reports a slow leak below the kitchen sink.",
      propertyId: "prop-001",
      unitId: "unit-101",
      tenantContactId: "tenant-001",
      vendorContactId: "vendor-001",
      priority: "high",
      status: "waiting_vendor",
      lastAppfolioUpdatedAt: "2026-06-15T02:45:00.000Z",
      createdAt: "2026-06-14T18:20:00.000Z"
    },
    {
      id: "wo-002",
      appfolioId: "WO-10497",
      title: "AC not cooling",
      description: "Tenant says AC is running but the unit is not cooling.",
      propertyId: "prop-001",
      unitId: "unit-204",
      tenantContactId: "tenant-002",
      priority: "medium",
      status: "in_progress",
      lastAppfolioUpdatedAt: "2026-06-15T03:10:00.000Z",
      createdAt: "2026-06-15T01:40:00.000Z"
    }
  ],
  notes: [
    {
      id: "note-001",
      workOrderId: "wo-001",
      body: "Vendor was assigned and asked to confirm arrival window.",
      author: "Maya Chen",
      createdAt: "2026-06-15T02:00:00.000Z",
      isInternalOnly: false
    },
    {
      id: "note-002",
      workOrderId: "wo-001",
      body: "# Owner approved emergency spend up to $450, but do not share this number with the tenant.",
      author: "Dian Property Admin",
      createdAt: "2026-06-15T02:15:00.000Z",
      isInternalOnly: true
    },
    {
      id: "note-003",
      workOrderId: "wo-002",
      body: "Maintenance staff inspected thermostat and requested HVAC vendor availability.",
      author: "Luis Romero",
      createdAt: "2026-06-15T03:05:00.000Z",
      isInternalOnly: false
    }
  ],
  messages: [
    {
      id: "msg-001",
      workOrderId: "wo-001",
      channel: "appfolio_sms",
      senderContactId: "tenant-001",
      body: "Do we have an ETA? The cabinet is getting wet and I need to know when someone is coming.",
      receivedAt: "2026-06-15T02:43:00.000Z",
      matchConfidence: "high"
    },
    {
      id: "msg-002",
      workOrderId: "wo-002",
      channel: "appfolio_email",
      senderContactId: "tenant-002",
      body: "Any update on the AC? It has been warm since last night.",
      receivedAt: "2026-06-15T03:08:00.000Z",
      matchConfidence: "medium"
    }
  ],
  recommendations: [],
  auditEvents: [
    {
      id: "audit-001",
      workOrderId: "wo-001",
      actor: "Sync Worker",
      action: "synced",
      description: "Work order and latest AppFolio communication synced.",
      createdAt: "2026-06-15T02:46:00.000Z"
    }
  ]
};

export function getDemoMaintenanceData(): MaintenanceDataSet {
  const cloned = JSON.parse(JSON.stringify(demoMaintenanceData)) as MaintenanceDataSet;
  cloned.recommendations = cloned.workOrders.map((workOrder) => buildRecommendation(cloned, workOrder.id));
  return cloned;
}
