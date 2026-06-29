# Backend API Foundation Plan — Go/Echo Phase 1

## 1. Summary

Build a modular Go backend in `apps/api` using:

- Echo for HTTP routing and middleware.
- PostgreSQL with `pgx`, `sqlc`, and SQL migrations.
- Two deployable binaries: API and worker.
- SQS queues with DLQs and EventBridge scheduling.
- Secure email/password authentication with opaque cookie sessions.
- Organization-scoped RBAC and PostgreSQL row-level security.
- Provider-neutral AppFolio and AI adapters.
- Human-reviewed recommendations with no outbound messaging.

The existing Next.js dashboard remains. TypeScript backend contracts move to an OpenAPI specification, with generated frontend types replacing manually duplicated production types in `packages/core`.

## 2. Architecture and Structure

```text
apps/api/
├── cmd/
│   ├── api/main.go
│   └── worker/main.go
├── internal/
│   ├── platform/
│   │   ├── config/
│   │   ├── database/
│   │   ├── httpserver/
│   │   ├── queue/
│   │   ├── logging/
│   │   └── observability/
│   ├── auth/
│   ├── authorization/
│   ├── audit/
│   ├── organizations/
│   ├── users/
│   ├── properties/
│   ├── contacts/
│   ├── workorders/
│   ├── messages/
│   ├── recommendations/
│   ├── integrations/appfolio/
│   ├── ai/
│   └── jobs/
├── db/
│   ├── migrations/
│   ├── queries/
│   └── generated/
├── api/openapi.yaml
└── test/
```

Each business module contains HTTP handlers, DTOs, services/use cases, repository interfaces, and SQL repository implementations. Handlers perform transport validation only; services own transactions and state transitions; repositories own persistence; authorization policies execute before repository results are returned or AI context is constructed.

API and worker share application code but run independently. Queue messages invoke application services directly rather than public/internal HTTP job endpoints.

## 3. Authentication, Authorization, and Tenant Isolation

### Authentication

Phase 1 will provide:

- Admin-created invitations with single-use, expiring tokens.
- Email/password login using Argon2id password hashes.
- Opaque, cryptographically random session tokens.
- Only token hashes stored in `user_sessions`.
- Secure, HttpOnly, SameSite cookies.
- CSRF protection for mutating cookie-authenticated requests.
- Logout, session revocation, password reset, and account disabling.
- Login throttling and generic credential-error messages.

Business services receive an `ActorContext`; they do not depend on passwords or Echo. A provider-neutral `IdentityAuthenticator` interface will later support OIDC providers such as Entra ID, Okta, Auth0, Google Workspace, or Cognito. `user_identities` maps external identities to internal users and organizations.

### RBAC

Initial roles:

- `admin`
- `property_manager`
- `maintenance_staff`

Permissions are action-oriented, including:

- `work_order.read`
- `work_order.review`
- `recommendation.generate`
- `recommendation.edit`
- `recommendation.approve`
- `recommendation.reject`
- `audit.read`
- `sync.manage`
- `organization.manage`
- `user.manage`

Roles map to permissions through `role_permissions`. `user_roles` are organization-scoped. Property assignments restrict managers and staff to designated properties; work-order access derives from property access. Admins receive organization-wide access.

Every service method accepts an `ActorContext` containing user, organization, permissions, assignments, request ID, and authentication method. The same policy layer filters data before AI context construction.

### Tenant isolation

- Every tenant-owned record includes `organization_id`.
- Composite foreign keys ensure related records belong to the same organization.
- Every SQL query requires organization scope.
- Request transactions set the PostgreSQL organization context.
- PostgreSQL RLS provides defense in depth.
- Worker jobs always carry and validate `organization_id`.
- Background workers process one organization context per transaction.
- Tenant-isolation tests attempt cross-organization reads and writes for every sensitive module.
- A future connection router can direct selected organizations to dedicated databases without changing service interfaces.

## 4. Database Foundation

Primary tables:

- Identity: `organizations`, `users`, `user_identities`, `user_sessions`, `invitations`, `password_reset_tokens`.
- Authorization: `roles`, `permissions`, `role_permissions`, `user_roles`, `user_property_assignments`.
- Portfolio: `properties`, `units`, `tenants`, `owners`, `vendors`.
- Maintenance: `work_orders`, `work_order_notes`, `work_order_attachments`.
- Communication: `messages`, `message_matches`.
- AI workflow: `ai_recommendations`, `recommendation_revisions`, `approval_events`.
- Integration: `integration_connections`, `integration_cursors`, `integration_payloads`, `sync_runs`.
- Operations: `job_executions`, `audit_events`, `outbox_events`.

Standards:

- UUID primary keys and UTC `timestamptz`.
- `organization_id` indexed first in tenant-scoped query indexes.
- External records use unique `(organization_id, source, external_id)` constraints.
- Work orders include an integer `version` for optimistic concurrency.
- Notes store source visibility and derived classification separately.
- Internal classification records classifier version and reason.
- Soft-disable users and integrations; do not soft-delete audit history.
- Audit and approval records are append-only to application roles.
- JSONB is limited to raw payloads, metadata, safety flags, and immutable snapshots—not core relational fields.
- Forward-only versioned SQL migrations run in CI and as a controlled deployment step.

Recommendation workflow is corrected from the draft model:

- `review_status`: `queued`, `processing`, `ready_for_review`, `approved`, `rejected`, or `failed`.
- Editing, copying, and manual-send marking are immutable events, not mutually exclusive recommendation statuses.
- `recommendation_revisions` preserves the original AI draft and every edited draft.
- `approval_events` records review actions and the exact revision involved.

## 5. API Standards and Endpoints

### Standards

- Public prefix: `/api/v1`.
- JSON uses `snake_case`; timestamps use RFC 3339 UTC.
- Successful resources are returned directly without a general envelope.
- Collections return `{ "items": [], "next_cursor": "..." }`.
- Cursor pagination is used for mutable operational lists.
- Filtering uses explicit query parameters; sorting uses allow-listed `sort` values.
- Errors use RFC 9457 problem details with `type`, `title`, `status`, `detail`, `code`, `request_id`, and field violations.
- All responses include `X-Request-ID`.
- Mutating workflow endpoints accept `Idempotency-Key`.
- Edit/approval requests require `expected_version`; stale writes return `409 Conflict`.
- OpenAPI is the source of truth for frontend clients and contract tests.

### Authentication and users

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/password/forgot`
- `POST /api/v1/auth/password/reset`
- `GET/POST /api/v1/users`
- `POST /api/v1/users/invitations`
- `PATCH /api/v1/users/{id}`
- `PUT /api/v1/users/{id}/roles`
- `PUT /api/v1/users/{id}/property-assignments`

Only admins manage users, roles, assignments, or invitations.

### Organizations and settings

- `GET/PATCH /api/v1/organization`
- `GET/PATCH /api/v1/settings`
- `GET/POST/PATCH /api/v1/integrations`

Sensitive integration responses expose status and masked metadata, never credentials.

### Portfolio and maintenance

- `GET /api/v1/properties`
- `GET /api/v1/properties/{id}`
- `GET /api/v1/properties/{id}/units`
- `GET /api/v1/tenants`
- `GET /api/v1/owners`
- `GET /api/v1/vendors`
- `GET /api/v1/work-orders`
- `GET /api/v1/work-orders/{id}`
- `GET /api/v1/work-orders/{id}/timeline`
- `GET /api/v1/work-orders/{id}/notes`
- `GET /api/v1/work-orders/{id}/messages`

List endpoints enforce organization and property policies before returning records. Search and filter inputs have length, enum, date-range, and page-size limits.

### Message matching

- `GET /api/v1/messages/unmatched`
- `POST /api/v1/messages/{id}/match`
- `POST /api/v1/messages/{id}/unmatch`

Manual matching validates that the message and work order belong to the same organization. Changing a match creates audit and outbox events and queues recommendation generation.

### Recommendation workflow

- `GET /api/v1/recommendations`
- `GET /api/v1/recommendations/{id}`
- `POST /api/v1/recommendations/{id}/regenerate`
- `PATCH /api/v1/recommendations/{id}/draft`
- `POST /api/v1/recommendations/{id}/approve`
- `POST /api/v1/recommendations/{id}/reject`
- `POST /api/v1/recommendations/{id}/copy-events`
- `POST /api/v1/recommendations/{id}/manual-send-events`

Approval uses a single authorized reviewer. Approval and rejection require `expected_version`; rejection requires a reason. Copy and manual-send events require an approved recommendation. Manual-send tracking records channel and optional external reference but performs no sending.

### Audit and operations

- `GET /api/v1/audit-events`
- `GET /api/v1/sync-runs`
- `GET /api/v1/sync-runs/{id}`
- `POST /api/v1/sync-runs` — admin-triggered enqueue
- `GET /api/v1/integration-health`
- `GET /health/live`
- `GET /health/ready`

## 6. AppFolio Integration and Jobs

Define an `AppFolioClient` interface for fetching work orders, notes, contacts, properties, units, messages, and attachment metadata. Cursor and page types remain provider-neutral.

Because access is unconfirmed, Phase 0 is a hard integration gate. Before confirmation, implement:

- Contract fixtures and a fake connector.
- Connection configuration without assuming a specific AppFolio API.
- Normalization interfaces and idempotent upserts.
- Capability flags for notes, messages, attachments, and write-back.
- No AppFolio write-back implementation.

Each sync:

1. Creates a `sync_runs` row.
2. Reads the entity cursor.
3. Fetches one source page.
4. Stores redacted raw payload metadata/content.
5. Normalizes and upserts records transactionally.
6. Writes outbox events for changed work orders.
7. Advances the cursor only after successful persistence.
8. Records counts, duration, errors, and completion status.

Retry rate-limit responses using provider guidance or exponential backoff with jitter. Authentication failures are not blindly retried. Partial entity failures remain resumable. Fallback email/SMS webhooks remain disabled until discovery proves AppFolio inbound communication insufficient; when enabled they require signature validation, replay protection, payload limits, and idempotency.

Queue payloads use:

```json
{
  "schema_version": 1,
  "job_id": "uuid",
  "job_type": "generate_recommendation",
  "organization_id": "uuid",
  "idempotency_key": "string",
  "correlation_id": "uuid",
  "requested_by": "user-or-service-id",
  "payload": {}
}
```

Jobs include AppFolio sync, message matching, recommendation generation, and stale-vendor checks. `job_executions` tracks attempts and terminal errors. SQS redrive policies send exhausted jobs to dedicated DLQs with alarms.

## 7. AI Recommendation Pipeline

1. Load the work order using organization and resource policies.
2. Build manager-visible and audience-shareable contexts separately.
3. Classify `#`, source-marked internal, owner-only, and private notes deterministically.
4. Exclude restricted content before prompt construction.
5. Build a versioned structured prompt with source identifiers.
6. Invoke a provider-neutral `ModelProvider`.
7. Parse and validate the structured response.
8. Run deterministic safety checks.
9. Persist recommendation, source references, model metadata, prompt version, confidence, exclusions, and flags.
10. Move the result to `ready_for_review` or `failed`.

Safety checks reject or flag drafts that:

- Contain internal-note content.
- Invent ETA, completion, appointment, cost approval, or liability claims.
- Lack grounding for factual statements.
- Fail urgent-hazard escalation rules.
- Target an audience inconsistent with the source message.

AI jobs execute as organization-scoped service actors. User-triggered regeneration additionally applies the initiating user’s resource access. Manager summaries may use authorized internal context, but tenant/vendor drafts receive only shareable context.

No provider or service interface will expose an outbound-send method during Phase 1.

## 8. Audit and Observability

Every mutation writes its domain change, audit event, and outbox event in one transaction.

Audit events record:

- Organization and actor.
- Authentication/service identity.
- Action and resource.
- Redacted before/after snapshots where useful.
- Recommendation and revision IDs.
- Request and correlation IDs.
- IP and user agent for HTTP requests.
- Timestamp and structured metadata.

Logs are structured JSON with secrets, session tokens, passwords, full message bodies, and raw PII excluded. Metrics cover request latency/errors, authorization denials, login failures, queue depth, DLQs, sync outcomes, recommendation latency/failures, safety flags, unmatched messages, and review backlog. CloudWatch alarms and runbooks cover repeated sync failure, AI outage, queue backlog, DLQ entries, API errors, and database pressure.

## 9. Testing and Acceptance

- Unit tests: policies, validators, transitions, note classification, matching, normalization, safety rules, and retry decisions.
- Repository integration tests: real PostgreSQL migrations, constraints, RLS, transactions, cursors, idempotency, and outbox behavior.
- Authorization tests: role/permission matrix plus property assignment boundaries.
- Tenant-isolation tests: malicious IDs, joins, pagination cursors, worker jobs, and cross-tenant relationships.
- Auth tests: password hashing, invitations, reset expiry, session rotation/revocation, CSRF, and throttling.
- AppFolio tests: fixture-based pagination, duplicate pages, partial failure, cursor resumption, and rate limiting.
- AI tests: fake provider, malformed output, prompt exclusion, internal-note leak attempts, hallucinated operational facts, and urgent cases.
- Workflow tests: edit history, stale-version conflicts, single approval, rejection, copy gating, manual-send gating, and idempotent retries.
- Audit tests: every mutation produces the expected immutable event with correlation data.
- Contract tests: OpenAPI request/response validation and generated frontend-client compatibility.
- End-to-end test: sync fixture → message match → recommendation → edit → approve → copy → manual-send mark → complete audit trail.

Acceptance requires zero cross-tenant access, zero internal-note content in tenant/vendor prompts or drafts, no automated outbound path, and audit coverage for every workflow transition.

## 10. Implementation Phases and First Five Tasks

1. **Go service foundation:** Replace the prototype API with the Go module, Echo API/worker entrypoints, configuration, structured errors, request IDs, health endpoints, logging, and OpenAPI skeleton.
2. **Database and tenancy:** Add migrations, `pgx`, `sqlc`, organization schema, RLS, repository transaction boundaries, audit/outbox foundations, and tenant-isolation tests.
3. **Authentication and RBAC:** Implement admin invitations, password/session flows, CSRF protection, roles, permissions, property assignments, and policy middleware/services.
4. **Maintenance read model:** Implement portfolio/work-order schema, seed fixtures, organization-scoped repositories, inbox/detail/timeline endpoints, pagination, and frontend contract generation.
5. **Integration and worker spine:** Add SQS job contracts, idempotency tracking, fake AppFolio adapter, sync-run/cursor processing, normalized work-order ingestion, retries, and DLQ behavior.

Subsequent work adds message matching, AI orchestration and safety, approval endpoints, audit UI support, real AppFolio adaptation after discovery, and production hardening.

## 11. Risks, Tradeoffs, and Assumptions

- Go replaces the current TypeScript API prototype; the Next.js frontend remains unchanged.
- A modular monolith is preferred over microservices for Phase 1; API and worker can be separated further without changing domain boundaries.
- `pgx` + `sqlc` preserves SQL control and type safety but requires disciplined query organization.
- RLS supplements explicit organization filters; it does not replace service-layer authorization.
- Single-reviewer approval is the Phase 1 rule, with policy hooks for risk-based multi-review later.
- Sync cadence defaults to a configurable five-minute schedule until AppFolio limits are known.
- ECS Fargate, RDS PostgreSQL, SQS, EventBridge, Secrets Manager, and CloudWatch are the default AWS deployment targets.
- AppFolio access, cursor semantics, inbound communication availability, attachment access, retention periods, and rate limits remain Phase 0 discoveries.
- Fallback inbound webhooks and all outbound/write-back behavior remain disabled by default.
