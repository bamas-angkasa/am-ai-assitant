# AI Asset Management Assistant Implementation Plan

## Core Rule

Every assistant interaction must follow this sequence:

1. Filter data first.
2. Check permission second.
3. Ask Claude or the mock AI third.
4. Audit everything.

Audit logging is required for every user conversation turn, including successful answers, permission denials, missing-data fallbacks, errors, and escalations.

## Target Structure

```txt
app/
  frontend/
  backend/
  docs/
  docker-compose.yml
  README.md
  .env.example
```

The frontend lives in `app/frontend`.
The backend lives in `app/backend`.
Shared documentation and local development files live at the root of `app`.

## Backend Plan

Create a Golang REST API that acts as the authority layer.

Required backend responsibilities:

- Resolve mock user identity and role.
- Load only related mock property data.
- Apply role-based permission filtering.
- Build a safe assistant context.
- Call Claude when configured.
- Use deterministic mock AI fallback when Claude is unavailable or `MOCK_AI=true`.
- Persist in-memory conversation history for the demo.
- Persist in-memory audit logs for every chat message and AI answer.
- Create escalations when the assistant cannot confidently answer or when the user requests a human.
- Provide PostgreSQL-ready repository/service structure.
- Keep AppFolio/PMS integration behind a dedicated boundary.

Required audit log fields:

- `id`
- `timestamp`
- `userId`
- `role`
- `conversationId`
- `action`
- `question`
- `answer`
- `allowed`
- `permissionReason`
- `dataScopes`
- `sourceRefs`
- `escalationCreated`
- `status`

Every `POST /chat` request must produce one audit log entry, even when:

- The user asks for unauthorized data.
- The assistant cannot find verified data.
- Claude returns an error.
- Mock AI fallback is used.
- An escalation is created.

Initial endpoints:

```txt
GET /health
POST /auth/mock-login
GET /auth/me
GET /roles
GET /properties
GET /properties/:id
POST /chat
GET /conversations
GET /conversations/:id
GET /audit-logs
GET /admin/overview
GET /admin/escalations
POST /maintenance-requests
GET /maintenance-requests
POST /escalations
```

## Frontend Plan

Create a Next.js App Router frontend using TypeScript, Tailwind CSS, and Lucide React.

Main screens:

- Landing / demo home
- Mock login role selector
- Chat assistant
- Property data preview
- Admin dashboard

Frontend responsibilities:

- Let stakeholders switch between demo roles.
- Send chat messages to the backend `/chat` endpoint.
- Display AI answers, loading states, errors, and escalation prompts.
- Show the current role and allowed context.
- Show admin overview, audit logs, conversation history, and escalations.
- Make clear that each role sees different data.

## Permission Rules

Tenant:

- Own lease, rent, payments, maintenance, and building announcements only.

Unit Owner:

- Owned units, related rent/payment status, maintenance status, and owner statement summary.

HOA / Board Member:

- Building-level summaries, common-area maintenance, safety issues, and announcements.
- No private tenant payment details.

Building Owner:

- Portfolio and property performance summaries.
- Limited private tenant detail.

Property Manager / Admin:

- Assigned properties, operational details, escalations, audit logs, and maintenance workflows.

## Documentation Plan

Create:

- `app/docs/product-requirements.md`
- `app/docs/architecture.md`
- `app/docs/api-contract.md`
- `app/docs/demo-script.md`

## Verification Plan

Verify that:

- Frontend builds.
- Backend compiles.
- `/chat` returns role-specific answers.
- Unauthorized data requests are blocked.
- Every `/chat` call creates an audit log.
- Admin dashboard can display audit logs and escalations.
- Docker Compose can start local services.
