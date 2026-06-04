# AI-Assisted Maintenance Inbox for AppFolio

A Phase 1 MVP boilerplate for an AI-assisted maintenance workflow connected to AppFolio maintenance data.

The goal of this project is to help property managers review maintenance-related context faster, summarize work orders and notes, understand tenant/vendor messages, and generate AI-recommended reply drafts with human approval before sending.

---

## Project Overview

This system is designed as an internal assistant for property management teams.

It is **not a fully autonomous chatbot in Phase 1**.

Instead, the system provides:

- AppFolio maintenance data sync
- Work order and notes summary
- Email/SMS message intake
- Message-to-work-order matching
- AI-generated intent detection
- AI-recommended reply drafts
- Human approval workflow
- Optional outbound email/SMS
- Audit logging
- Owner-only/internal note protection using `#`

---

## Phase 1 Main Concept

```txt
AppFolio Maintenance Data
        |
Our Integration Layer
        |
Internal Database
        |
AI Context Builder
        |
AI Summary + Reply Recommendation
        |
Property Manager Approval Dashboard
        |
Approved Email/SMS Response
        |
Audit Log
```

---

## Important AppFolio API Limitation

Based on the publicly visible AppFolio Stack API documentation, AppFolio can expose maintenance-related objects such as:

* Work Orders
* Properties
* Units
* Tenants
* Owners
* Vendors
* Users
* Attachments

However, there is no confirmed public API endpoint for reading newly received AppFolio email/SMS inbox messages.

Therefore, the recommended Phase 1 architecture is:

* Use AppFolio as the maintenance data source.
* Use a separate email provider for inbound email.
* Use Twilio or another SMS provider for inbound/outbound SMS.
* Match incoming messages to AppFolio work orders inside our system.

---

## Technical Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* React Hook Form
* Zod

### Backend

* Golang
* Gin / Chi / Echo
* PostgreSQL
* Redis
* SQLC or GORM
* Goose / Atlas for migrations
* Background worker for sync jobs

### AI Layer

* OpenAI API or Anthropic Claude API
* Structured JSON output for:

  * Intent detection
  * Urgency detection
  * Work order summary
  * Reply recommendation
  * Risk/confidence flag

### Messaging

* Email inbound:

  * SendGrid Inbound Parse, Mailgun Routes, Amazon SES, Gmail API, or Microsoft Graph
* SMS inbound/outbound:

  * Twilio webhook and Messaging API

### Infrastructure

* Docker
* Docker Compose
* AWS / GCP / Azure / VPS
* PostgreSQL managed database or self-hosted
* Object storage for attachments/photos
* GitHub Actions for CI/CD
* Environment-based deployment:

  * local
  * staging
  * production

---

## Recommended Monorepo Structure

```txt
app/
|-- apps/
|   |-- frontend/
|   |   |-- src/
|   |   |-- package.json
|   |   |-- next.config.mjs
|   |   `-- README.md
|   |
|   `-- backend/
|       |-- cmd/
|       |   |-- api/
|       |   |-- worker/
|       |   `-- sync/
|       |
|       |-- internal/
|       |   |-- appfolio/
|       |   |-- ai/
|       |   |-- auth/
|       |   |-- config/
|       |   |-- database/
|       |   |-- email/
|       |   |-- sms/
|       |   |-- workorder/
|       |   |-- message/
|       |   |-- approval/
|       |   |-- audit/
|       |   `-- policy/
|       |
|       |-- migrations/
|       |-- go.mod
|       `-- README.md
|
|-- docker-compose.yml
|-- .env.example
|-- package.json
|-- README.md
`-- docs/
    |-- appfolio-ai.md
    |-- architecture.md
    |-- api.md
    `-- deployment.md
```

---

## Core Modules

### 1. AppFolio Connector

Responsible for syncing maintenance-related data from AppFolio.

Expected data:

* Work orders
* Work order notes, if available
* Tenants
* Owners
* Vendors
* Properties
* Units
* Attachments

Responsibilities:

* API authentication
* Delta sync / polling
* Rate limit handling
* Retry logic
* Data normalization
* Idempotent upsert
* Sync audit logging

---

### 2. Email Inbound Service

Responsible for capturing incoming maintenance emails.

Possible providers:

* SendGrid Inbound Parse
* Mailgun Routes
* Amazon SES Inbound
* Gmail API
* Microsoft Graph API

Responsibilities:

* Receive inbound email webhook
* Parse sender, subject, body, and attachments
* Normalize sender email
* Store raw and cleaned email content
* Match email to tenant/vendor/owner/work order

---

### 3. SMS Inbound Service

Responsible for receiving SMS through Twilio or another SMS provider.

Responsibilities:

* Receive Twilio inbound SMS webhook
* Normalize phone number to E.164 format
* Store raw SMS payload
* Match sender phone number to tenant/vendor/owner
* Link SMS to related work order if possible

---

### 4. Message-to-Work-Order Matcher

Responsible for linking inbound email/SMS to a relevant AppFolio work order.

Matching signals:

* Sender email
* Sender phone number
* Tenant/vendor/owner contact
* Work order ID in subject/body
* Property name
* Unit number
* Maintenance issue keywords
* Recent open work orders
* Manual override from property manager

---

### 5. Owner-Only Policy Engine

Responsible for protecting internal or owner-only notes.

Convention:

```txt
# Owner does not want to approve repair above $500 without confirmation.
```

Rules:

* Notes starting with `#` are treated as owner-only/internal.
* Owner-only notes must not be included in tenant/vendor reply context.
* Owner-only notes can be shown only to authorized internal users.
* AI context must be filtered before being sent to the AI provider.

---

### 6. AI Context Builder

Responsible for preparing safe context before calling AI.

Context may include:

* Work order title
* Work order status
* Priority
* Property/unit
* Tenant/vendor information
* Latest public notes
* Latest inbound email/SMS
* Previous conversation history
* Attachment summary, if available

Excluded context:

* Owner-only notes for tenant/vendor replies
* Sensitive internal data
* Unauthorized financial or private information

---

### 7. AI Recommendation Engine

Responsible for generating AI output.

Expected outputs:

```json
{
  "summary": "Tenant is asking for an update on a leaking pipe repair.",
  "intent": "status_update_request",
  "urgency": "medium",
  "recommended_action": "reply_to_tenant_with_vendor_eta",
  "suggested_reply": "Hi Sarah, the plumbing vendor is scheduled to visit your unit on Friday at 10:00 AM. We will keep you updated if anything changes.",
  "confidence": "high",
  "risk_flags": []
}
```

The AI should never send responses directly.

---

### 8. Approval Workflow

Responsible for human review before outbound communication.

Property manager can:

* Review AI summary
* Review related work order context
* Review suggested reply
* Edit reply
* Approve
* Reject
* Re-link message to another work order
* Send approved response

---

### 9. Outbound Messaging

Optional in Phase 1.

Supported channels:

* Email
* SMS via Twilio
* Manual copy-ready draft

Responsibilities:

* Send approved reply only
* Store delivery status
* Store provider message ID
* Log final message content
* Optional AppFolio write-back if supported

---

### 10. Audit Log

Every important action should be logged.

Audit events:

* AppFolio sync completed
* Inbound email received
* Inbound SMS received
* Message matched to work order
* AI recommendation generated
* Property manager edited reply
* Reply approved
* Reply sent
* Reply failed
* AppFolio write-back completed or failed

---

## Suggested Database Tables

```txt
users
roles
permissions

appfolio_connections
appfolio_sync_logs

properties
units
tenants
owners
vendors

work_orders
work_order_notes
work_order_attachments

inbound_messages
message_work_order_links
conversation_threads

ai_recommendations
approval_actions
outbound_messages

audit_logs
```

---

## Environment Variables

Create `.env` from `.env.example`.

```env
APP_ENV=local
APP_PORT=8080

DATABASE_URL=postgres://user:password@localhost:5432/appfolio_ai?sslmode=disable
REDIS_URL=redis://localhost:6379

APPFOLIO_API_BASE_URL=
APPFOLIO_CLIENT_ID=
APPFOLIO_CLIENT_SECRET=
APPFOLIO_ACCESS_TOKEN=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=

SENDGRID_API_KEY=
SENDGRID_INBOUND_SECRET=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

JWT_SECRET=
ENCRYPTION_KEY=
```

---

## Local Development

### Prerequisites

Install:

* Node.js 20+
* pnpm / npm / yarn
* Go 1.22+
* PostgreSQL 16+
* Redis
* Docker and Docker Compose

---

### Start Local Services

```bash
docker compose up -d postgres redis
```

---

### Backend Setup

```bash
cd apps/backend

cp .env.example .env

go mod download

go run ./cmd/api
```

Optional worker:

```bash
go run ./cmd/worker
```

Optional sync service:

```bash
go run ./cmd/sync
```

---

### Frontend Setup

```bash
cd apps/frontend

cp .env.example .env.local

pnpm install
pnpm dev
```

Frontend runs on:

```txt
http://localhost:3000
```

Backend runs on:

```txt
http://localhost:8080
```

---

## Docker Compose Example

```yaml
services:
  postgres:
    image: postgres:16
    container_name: appfolio_ai_postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: appfolio_ai
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: appfolio_ai_redis
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## API Overview

### Work Orders

```txt
GET    /api/work-orders
GET    /api/work-orders/:id
POST   /api/work-orders/:id/sync
```

### Messages

```txt
GET    /api/messages
GET    /api/messages/:id
POST   /api/messages/:id/match-work-order
```

### Email Webhook

```txt
POST   /webhooks/email/inbound
```

### SMS Webhook

```txt
POST   /webhooks/sms/twilio
```

### AI Recommendation

```txt
POST   /api/ai/recommendations
GET    /api/ai/recommendations/:id
```

### Approval

```txt
POST   /api/approvals/:recommendationId/approve
POST   /api/approvals/:recommendationId/reject
POST   /api/approvals/:recommendationId/edit
```

### Outbound Messages

```txt
POST   /api/outbound/email
POST   /api/outbound/sms
```

---

## Frontend Pages

```txt
/dashboard
/dashboard/inbox
/dashboard/work-orders
/dashboard/work-orders/:id
/dashboard/messages/:id
/dashboard/ai-recommendations/:id
/dashboard/audit-logs
/settings/integrations
/settings/users
/settings/roles
```

---

## Main UI Screens

### Maintenance Inbox

Shows maintenance-related messages and work orders that need attention.

### Work Order Detail

Shows work order context, notes, AI summary, and related messages.

### AI Recommendation Review

Shows suggested reply, confidence, reason, and approval actions.

### Audit Log

Shows all AI, approval, and outbound messaging activity.

---

## Phase 1 Scope

| Module                         | Status      |
| ------------------------------ | ----------- |
| AppFolio Maintenance Sync      | Required    |
| Work Order Notes               | Conditional |
| Owner-only Notes using `#`     | Required    |
| Email Inbound                  | Optional    |
| SMS Inbound via Twilio         | Optional    |
| Message Matching               | Optional    |
| AI Summary                     | Required    |
| AI Intent Detection            | Required    |
| AI Reply Draft                 | Required    |
| Vendor Reminder Recommendation | Required    |
| Human Approval                 | Required    |
| Outbound Email/SMS             | Optional    |
| Audit Log                      | Required    |
| Deployment                     | Required    |

---

## Out of Scope for Phase 1

* Fully autonomous chatbot
* Tenant-facing chatbot
* Owner-facing chatbot
* Automatic response without approval
* Full AppFolio replacement
* Payment or billing integration
* Complex reporting dashboard
* Automatic vendor dispatch
* Advanced predictive maintenance

---

## Deployment Plan

### Local

For development and testing.

Components:

* Frontend
* Backend API
* PostgreSQL
* Redis
* Worker

### Staging

For customer UAT.

Components:

* Staging frontend URL
* Staging backend API
* Staging database
* Test email/SMS provider configuration
* Test AI provider key
* AppFolio sandbox/test data if available

### Production

For live customer usage.

Components:

* Production frontend
* Production backend API
* Production worker
* Production database
* Email/SMS provider
* Monitoring and logging
* Backup strategy
* Secret management

---

## Security Considerations

* Store third-party API keys securely.
* Encrypt sensitive credentials.
* Apply role-based access control.
* Filter `#` owner-only notes before AI processing.
* Do not send AI-generated responses automatically.
* Log all approval and outbound actions.
* Avoid storing unnecessary personal data.
* Mask sensitive data in logs.
* Verify email/SMS webhook signatures where supported.

---

## Development Principles

* AppFolio remains the system of record for maintenance data.
* Our internal database is used for AI context, matching, approval, and audit.
* AI output must be explainable and reviewable.
* Human approval is required before sending any response.
* Optional communication channels should be modular.
* AppFolio write-back should only be enabled if officially supported.

---

## Future Phases

### Phase 2

* Smarter vendor reminders
* Better work order matching
* Attachment/photo AI summary
* SLA monitoring
* Role-based owner dashboard

### Phase 3

* Tenant-facing chatbot
* Owner-facing assistant
* Vendor assistant
* Self-service maintenance updates

### Phase 4

* Predictive maintenance
* Vendor performance analytics
* Portfolio-level dashboard
* Cost approval automation

---

## License

Private project.

---

## Maintainers

Project owner:

```txt
Bamas Angkasa
```

