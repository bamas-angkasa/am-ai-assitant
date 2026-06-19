# AppFolio Maintenance AI Assistant - Product Requirements Document

**Product:** AppFolio Maintenance AI Assistant  
**Repository:** `am-ai-assitant`  
**Document status:** Draft  
**Document scope:** Whole app, including web dashboard, backend API, worker services, AI recommendation engine, AppFolio sync, audit, monitoring, and the existing demo experience.  
**Primary users:** Property managers, maintenance staff, admins  
**Secondary context actors:** Tenants, vendors, owners, AppFolio, fallback email/SMS providers  

---

## 1. Executive Summary

AppFolio Maintenance AI Assistant is an internal AI-assisted maintenance operations tool for property management teams.

The app helps managers quickly understand active maintenance work orders, review relevant AppFolio context, inspect inbound tenant/vendor/owner messages, and approve safe AI-recommended response drafts. The product is designed around a strict human-in-the-loop model: AI can summarize, classify, recommend, and draft, but Phase 1 does not send messages automatically.

The current repository contains two product tracks:

- A legacy/demo Dian AI Assistant that proves role-aware property data answering with mock AppFolio-style data.
- A newer AppFolio Maintenance AI Assistant dashboard concept focused on internal maintenance inbox review and approval.

This PRD defines the whole target app and clarifies which features belong to the production MVP versus demo-only or future phases.

---

## 2. Product Vision

Property managers should be able to open one operational inbox, see every important maintenance case, understand what happened, know what the resident or vendor is asking, and safely approve the next response without hunting across AppFolio notes, messages, contacts, and spreadsheets.

The product should reduce response delays and repetitive manual review while preserving manager control, auditability, and data privacy.

---

## 3. Problem Statement

Maintenance communication is fragmented across AppFolio records, work order notes, tenant messages, vendor updates, emails, texts, phone calls, and internal staff knowledge.

This creates several problems:

- Managers spend too much time reconstructing the latest status.
- Tenants and vendors repeatedly ask for updates.
- Internal or owner-only notes can accidentally leak into tenant/vendor communication.
- Staff need a reliable audit trail for AI suggestions, edits, approvals, rejections, and manual sends.
- Automation is risky unless the system can prove what context was used and what context was excluded.

The core product question:

> How can we help property managers respond to maintenance communication faster while keeping humans in control and preventing private context leakage?

---

## 4. Goals

## 4.1 Business Goals

- Reduce manual time spent reviewing maintenance context.
- Improve tenant and vendor response speed.
- Increase consistency and quality of maintenance replies.
- Create a safe foundation for future communication automation.
- Provide a clear audit trail for AI-assisted decisions.
- Establish production-ready AppFolio sync and monitoring.

## 4.2 User Goals

- See live maintenance cases in one inbox.
- Understand current work order status quickly.
- See the latest shareable and internal context clearly separated.
- Review AI summary, detected intent, recommended action, and draft reply.
- Edit, approve, reject, copy, and mark manual send.
- Trust that tenant/vendor drafts do not expose owner-only or internal notes.

## 4.3 Non-Goals for Phase 1

- No automatic outbound email or SMS.
- No tenant-facing chatbot in production Phase 1.
- No vendor dispatch automation.
- No legal, insurance, liability, or payment decisioning.
- No AppFolio write-back unless entitlement and safe write behavior are confirmed.

---

## 5. Product Scope

## 5.1 Current Demo Scope

The existing demo experience may continue to support:

- Mock user selector.
- Role-aware property data Q&A.
- Mock AppFolio-style data import/export.
- Local permission checks.
- Live agent handoff simulation.
- Debug/reasoning panel.

This is useful for stakeholder demos and proving access-control concepts, but it is not the production Phase 1 maintenance inbox.

## 5.2 Phase 1 MVP Scope

Phase 1 production MVP must include:

- Internal maintenance inbox.
- AppFolio work order sync.
- Work order notes sync.
- Tenant, vendor, owner, property, and unit context sync.
- Inbound communication sync if AppFolio exposes it.
- Fallback inbound email/SMS only if AppFolio inbound communication is unavailable.
- Message-to-work-order matching.
- AI recommendation generation.
- Deterministic safety checks.
- Human approval workflow.
- Copy-ready approved draft.
- Manual-send tracking.
- Audit log.
- Sync health dashboard.
- Monitoring and alerting.
- Role-based internal access control.

## 5.3 Future Scope

Future phases may include:

- AppFolio write-back.
- Tenant-facing assistant.
- Vendor-facing portal or messaging.
- Automatic outbound communication after strict approval rules.
- Attachment/photo AI analysis.
- Multi-client organization management.
- Advanced analytics and SLA reporting.
- Deeper owner reporting.

---

## 6. Users and Roles

| Role | Phase 1 Product Access | Notes |
| --- | --- | --- |
| Admin | Full app access, settings, integrations, audit, users, sync health | Internal role only |
| Property Manager | Maintenance inbox, work order detail, AI review, approval workflow | Primary user |
| Maintenance Staff | Work order context, notes, vendor status, limited review support | Internal role |
| Owner | Not a primary dashboard user in Phase 1 | Context actor only unless enabled later |
| Vendor | Not a dashboard user in Phase 1 | Context actor only |
| Tenant | Not a dashboard user in Phase 1 | Context actor only |

---

## 7. Core User Journeys

## 7.1 New Work Order Sync

1. Scheduled worker runs AppFolio sync.
2. Worker pulls changed work orders and related records.
3. Raw payloads are stored for traceability.
4. Records are normalized into operational tables.
5. Changed work orders queue AI recommendation jobs.
6. Dashboard shows the work order in the inbox.

## 7.2 AI Recommendation Review

1. Manager opens the maintenance inbox.
2. Manager selects a work order.
3. App shows work order, property, unit, tenant, vendor, notes, messages, and timeline.
4. App shows AI summary, detected intent, recommended action, draft reply, confidence, and safety flags.
5. Manager edits the draft if needed.
6. Manager approves or rejects.
7. Approved draft becomes copy-ready.
8. Manager sends manually through AppFolio, email, SMS, or existing workflow.
9. Manager marks manually sent.
10. Audit log records every action.

## 7.3 Internal Note Protection

1. Work order contains notes from AppFolio.
2. Notes beginning with `#` or marked owner-only/internal are classified as internal context.
3. AI may use internal context for manager-facing summary if allowed.
4. AI must not include internal context in tenant/vendor-facing drafts.
5. Safety flag confirms excluded internal context.

## 7.4 Low-Confidence Message Match

1. Inbound message cannot be confidently matched to a work order.
2. System saves message with low-confidence match or manual-review status.
3. Dashboard shows "Needs manual matching."
4. Manager links the message to a work order.
5. AI recommendation job is queued.

---

## 8. Functional Requirements

## 8.1 Web Dashboard

The web app must provide:

- Maintenance inbox list.
- Work order detail page.
- Recommendation review panel.
- Timeline of notes, inbound messages, status changes, AI events, and approval events.
- Audit log view.
- Sync health view.
- Settings area for integrations and account configuration.
- Responsive desktop and tablet layout.

The dashboard must never show a production `Send` CTA in Phase 1. The post-approval primary action is `Copy Approved Draft`.

## 8.2 Maintenance Inbox

The inbox must display:

- Work order ID.
- Title and category.
- Property and unit.
- Tenant and vendor.
- Priority.
- Status.
- Latest inbound message.
- Recommendation status.
- Stale vendor indicator.
- Manual match indicator.
- Last updated timestamp.

Required filters:

- Ready for review.
- Needs manual matching.
- Urgent.
- Waiting vendor.
- Waiting tenant.
- Stale.
- Failed AI.
- Recently approved.

## 8.3 Work Order Detail

The work order detail must display:

- AppFolio work order fields.
- Property and unit context.
- Tenant contact context.
- Vendor contact context.
- Owner context where authorized.
- Work order notes.
- Internal/owner-only note indicators.
- Inbound communication timeline.
- Attachments/photo references if available.
- AI recommendation details.
- Approval history.

## 8.4 AI Recommendation Panel

The recommendation panel must display:

- Summary.
- Detected intent.
- Recommended action.
- Audience.
- Draft reply.
- Final edited reply if present.
- Confidence.
- Safety flags.
- Source context used.
- Source context excluded.

Actions:

- Regenerate recommendation.
- Edit draft.
- Approve draft.
- Reject draft.
- Copy approved draft.
- Mark manually sent.

Business rules:

- Copy is available only after approval.
- Manual send mark is available only after approval or copy.
- Rejected recommendations cannot be copied.
- Regeneration must create a new audit event.

## 8.5 Backend API

The backend API must support:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Service health |
| `GET` | `/api/work-orders` | List inbox work orders |
| `GET` | `/api/work-orders/:id` | Get full work order detail |
| `GET` | `/api/work-orders/:id/timeline` | Get notes, messages, and events |
| `GET` | `/api/recommendations` | List recommendations |
| `GET` | `/api/recommendations/:id` | Get recommendation detail |
| `POST` | `/api/recommendations/:id/refresh` | Queue regeneration |
| `POST` | `/api/recommendations/:id/approve` | Approve original or edited draft |
| `POST` | `/api/recommendations/:id/reject` | Reject recommendation |
| `POST` | `/api/recommendations/:id/copy` | Track copied draft |
| `POST` | `/api/recommendations/:id/mark-manual-sent` | Track manual send |
| `GET` | `/api/audit-events` | Query audit log |
| `GET` | `/api/sync-runs` | View sync health |

Internal endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/internal/jobs/appfolio-sync` | Trigger sync |
| `POST` | `/internal/jobs/message-match` | Match message |
| `POST` | `/internal/jobs/generate-recommendation` | Generate AI recommendation |
| `POST` | `/internal/jobs/stale-vendor-check` | Generate vendor follow-up recommendations |

Fallback webhooks:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/webhooks/email/inbound` | Receive fallback inbound email |
| `POST` | `/webhooks/twilio/sms` | Receive fallback inbound SMS |

Fallback webhooks must stay disabled unless AppFolio inbound communication is unavailable or insufficient.

## 8.6 Worker Services

Worker services must support:

- Scheduled AppFolio sync.
- Incremental sync cursors.
- Raw payload persistence.
- Normalization.
- Message matching.
- AI recommendation generation.
- Retry handling.
- Dead-letter handling.
- Stale vendor checks.
- Failure logging.

## 8.7 AppFolio Sync

The AppFolio connector must sync, when available:

- Work orders.
- Work order notes.
- Tenants.
- Vendors.
- Owners.
- Properties.
- Units.
- Inbound communications.
- Attachment references.

The sync must:

- Be incremental.
- Store raw payloads.
- Be idempotent.
- Track sync cursor per entity.
- Record sync run status.
- Continue safely after partial failures.

## 8.8 AI Recommendation Engine

The AI system must:

- Build work order context.
- Split context into internal-only and shareable sections.
- Exclude `#` notes from tenant/vendor drafts.
- Generate structured output.
- Validate output schema.
- Run deterministic safety checks.
- Store recommendation status and errors.
- Never send messages.

Supported intents:

- `asking_eta`
- `reporting_new_issue`
- `requesting_update`
- `confirming_schedule`
- `cost_approval`
- `vendor_follow_up`
- `urgency_escalation`
- `general_update`

---

## 9. Data Requirements

Required operational tables:

- `organizations`
- `users`
- `properties`
- `units`
- `tenants`
- `owners`
- `vendors`
- `work_orders`
- `work_order_notes`
- `work_order_attachments`
- `messages`
- `message_matches`
- `ai_recommendations`
- `approval_events`
- `sync_runs`
- `integration_payloads`
- `audit_events`

Minimum recommendation fields:

- ID.
- Work order ID.
- Source message ID.
- Status.
- Summary.
- Detected intent.
- Recommended action.
- Audience.
- Draft reply.
- Final edited reply.
- Internal context excluded flag.
- Safety flags.
- Confidence.
- Source context used.
- Source context excluded.
- Created and updated timestamps.

---

## 10. Permissions and Visibility

The app must enforce permissions at the API/service layer, not only in the UI.

Principles:

- Filter context before AI prompt construction.
- Store internal and shareable context separately.
- Do not expose tenant/vendor/private owner details to unauthorized roles.
- Do not depend on the model to hide sensitive data.
- Audit every recommendation and approval workflow action.

Role access:

- Admin can access all organization data.
- Property manager can access assigned organization/building/work order data.
- Maintenance staff can access operational maintenance context according to assignment.
- Tenant/vendor/owner are not Phase 1 dashboard users.

---

## 11. AI Safety Requirements

Deterministic rules:

- Never send automatically.
- Never include notes marked with `#` in tenant/vendor replies.
- Never expose owner-only or private internal context to tenant/vendor audiences.
- Never invent vendor ETA, cost approval, completion status, or appointment confirmation.
- Never make legal, insurance, or liability claims.
- Flag urgent issues including flooding, fire, electrical danger, gas leak, lockout, and active water intrusion.
- Use source-grounded language.
- Include safety flags when source data is missing or ambiguous.

AI output must include:

- Summary.
- Intent.
- Recommended next action.
- Draft reply.
- Safety flags.
- Confidence.
- Source context used.
- Source context excluded.

---

## 12. Non-Functional Requirements

## 12.1 Performance

- Inbox list loads within 2 seconds for normal tenant-sized portfolios.
- Work order detail loads within 2 seconds after selection.
- AI recommendation generation target is under 30 seconds for standard cases.
- Dashboard interactions should feel instant after data is loaded.

## 12.2 Reliability

- Sync jobs must be idempotent.
- Failed jobs must retry safely.
- Repeated failures must land in dead-letter queues.
- AI failures must set recommendation status to `failed` with visible reason.
- API must return clear error responses.

## 12.3 Security

- Authentication is required for production.
- Internal endpoints require service authentication.
- Secrets are stored in AWS Secrets Manager or equivalent.
- Webhooks require signature verification when enabled.
- Audit events are append-only from product perspective.
- Sensitive logs are redacted.

## 12.4 Accessibility

- Keyboard-accessible controls.
- Clear labels for text areas and actions.
- Sufficient color contrast.
- Non-color-only status indicators.
- Responsive layouts without overlap or clipping.

## 12.5 Observability

The system must monitor:

- Sync success/failure.
- Sync duration.
- Records processed.
- API 5xx rate.
- Worker job failures.
- Queue depth.
- Dead-letter queue count.
- AI failures.
- Recommendation latency.
- Manual review backlog.
- Webhook failures if enabled.
- Database CPU/storage/connections.

---

## 13. Technical Architecture

Target architecture:

- Next.js web dashboard.
- Backend API service.
- Worker service.
- PostgreSQL database.
- SQS queues and dead-letter queues.
- EventBridge scheduler.
- AI provider abstraction.
- AWS deployment with logs, metrics, alarms, and secrets.

Local development may use:

- Mock AppFolio data.
- Seed scripts.
- Local database.
- Local worker execution.
- Demo API route for sample data.

The API and web app should share domain types through `packages/core`, but production state transitions must live in the backend/database, not only in client state.

---

## 14. Release Phases

## 14.1 Phase 0 - Discovery and Access Validation

Deliverables:

- AppFolio access confirmation.
- Available endpoint/table report.
- Entity mapping.
- Inbound communication availability decision.
- Attachment availability decision.
- Rate limit and auth findings.

## 14.2 Phase 1A - Backend Foundation

Deliverables:

- PostgreSQL schema.
- Backend API skeleton.
- Auth and role model.
- Worker skeleton.
- Queue contracts.
- Audit event foundation.
- Seed data.

## 14.3 Phase 1B - AppFolio Sync

Deliverables:

- Connector skeleton.
- Work order sync.
- Notes sync.
- Contact/property/unit sync.
- Raw payload storage.
- Sync cursors.
- Sync health API and dashboard.

## 14.4 Phase 1C - AI Recommendation Pipeline

Deliverables:

- Context builder.
- Internal/shareable splitter.
- `#` note classifier.
- Prompt builder.
- Structured output parser.
- Safety checker.
- Recommendation persistence.
- Retry/failure handling.

## 14.5 Phase 1D - Dashboard MVP

Deliverables:

- Inbox.
- Work order detail.
- Review panel.
- Edit/approve/reject/copy/manual-send workflow.
- Audit log view.
- Realtime or periodic updates.

## 14.6 Phase 1E - UAT and Production Hardening

Deliverables:

- Staging deployment.
- Production deployment.
- Monitoring and alerts.
- Runbooks.
- Security review.
- Backup and restore test.
- Client UAT fixes.

---

## 15. Acceptance Criteria

The whole Phase 1 app is accepted when:

- AppFolio work orders sync into the database.
- Notes, contacts, properties, units, tenants, and vendors sync where available.
- AppFolio inbound communications sync if available.
- Fallback inbound path is documented or implemented only if needed.
- Property managers can view the maintenance inbox.
- Managers can open a work order and see complete synced context.
- AI generates summary, intent, recommended action, and draft reply.
- Tenant/vendor drafts exclude `#` owner-only/internal notes.
- Managers can edit, approve, reject, copy, and mark manually sent.
- Copy/manual-send actions are blocked until approval.
- No automatic outbound email/SMS exists in Phase 1.
- Audit log records AI draft, edited draft, approval/rejection/copy/manual-send, user, and timestamp.
- Sync, AI, queue, API, and database failures are monitored.
- Staging and production deployments are complete.

---

## 16. Testing Requirements

Unit tests:

- Payload normalization.
- `#` note classification.
- Visibility filtering.
- Message matching scoring.
- AI output validation.
- Recommendation status transitions.
- Permission checks.

Integration tests:

- Sync creates work orders.
- Sync updates existing work orders.
- Notes attach to correct work orders.
- Inbound messages match work orders.
- Low-confidence messages enter manual review.
- AI job creates recommendation.
- Approval creates audit events.
- Copy/manual-send transitions are persisted.

End-to-end tests:

- New work order appears in inbox.
- AI recommendation appears in detail view.
- Manager edits and approves draft.
- Manager copies approved draft.
- Manager marks manually sent.
- Audit log shows original draft, edited draft, approver, and timestamps.
- `#` note content is absent from tenant/vendor draft.

Failure tests:

- AppFolio sync failure retries.
- AI provider failure sets recommendation to `failed`.
- Message cannot be matched and enters manual review.
- Queue failure lands in dead-letter queue.

---

## 17. Current Implementation Snapshot

As of this PRD draft, the repo includes:

- `apps/web`: Next.js web app.
- `apps/api`: minimal Node HTTP API.
- `packages/core`: shared types and demo maintenance recommendation logic.
- Main dashboard route renders a mock maintenance inbox.
- Legacy `/demo` route renders the older Dian role-aware chatbot.
- API currently exposes health and demo maintenance data only.
- Review workflow is currently client-state demo behavior.

Known implementation gaps:

- No production database schema yet.
- No persisted approval workflow yet.
- No AppFolio connector yet.
- No worker service yet.
- No queue contracts yet.
- No real auth yet.
- No tests yet.
- `#` note exclusion must be enforced defensively during context building, not only by trusting preclassified note flags.

---

## 18. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| AppFolio API access is limited | Sync scope may shrink | Run Phase 0 discovery before committing integration scope |
| Internal notes leak into drafts | High privacy risk | Deterministic context splitter and safety tests |
| AI invents ETA or approval | Trust and operational risk | Prompt constraints plus deterministic safety checks |
| Workflow remains UI-only | No audit or reliability | Move all state transitions to backend API and database |
| Inbound messages unavailable in AppFolio | Core workflow gap | Use fallback email/Twilio inbound only after discovery |
| Scope expands into tenant chatbot | Phase 1 delay | Keep tenant-facing assistant as future phase |

---

## 19. Open Questions

1. What exact AppFolio access method is available: API, MAX, database export, report export, or other?
2. Are inbound AppFolio email/SMS/communication records accessible?
3. Which work order note formats indicate owner-only or internal content besides `#`?
4. Which internal users need access in Phase 1?
5. Is SSO required for production?
6. Should approval require one manager or multiple reviewers for urgent/cost cases?
7. What is the expected sync frequency?
8. What deployment target is preferred: AWS App Runner, ECS Fargate, or another platform?
9. Are there client-specific retention requirements for raw payloads and audit logs?

---

## 20. Success Metrics

Product metrics:

- Average time to understand a work order before and after AI.
- Percentage of recommendations approved without major edit.
- Manual review backlog.
- Time from inbound message to approved draft.
- Number of safety flags triggered.
- Number of internal notes excluded.

Operational metrics:

- Sync success rate.
- Recommendation generation success rate.
- API error rate.
- Queue backlog.
- Dead-letter count.
- Recommendation latency.

Quality metrics:

- Zero known internal-note leaks.
- Zero automated outbound sends in Phase 1.
- Audit coverage for all recommendation state transitions.

---

## 21. One-Sentence Summary

AppFolio Maintenance AI Assistant is a human-approved maintenance inbox that syncs AppFolio context, generates safe AI summaries and draft replies, protects internal notes, and gives property managers an auditable workflow for faster maintenance communication.
