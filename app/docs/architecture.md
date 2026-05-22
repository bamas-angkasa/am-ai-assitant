# Architecture

## Monorepo

```txt
app/
  frontend/
  backend/
  docs/
```

## Frontend

The frontend is a Next.js App Router application with a responsive chat UI, role selector, property context panel, and admin dashboard.

The frontend does not enforce sensitive permissions. It displays what the backend returns.

## Backend

The Golang backend owns:

- Mock authentication
- Role resolution
- Data filtering
- Permission checks
- Assistant orchestration
- Conversation history
- Audit logs
- Escalations
- AppFolio integration boundary

## AI Flow

```txt
Receive message
Resolve user
Load related data
Filter by role/property scope
Check permission
Build safe context
Call Claude or mock AI
Save conversation
Save audit log
Return answer
```

Claude must never receive global property data.

## Audit Flow

Every chat request creates one audit log entry with user, role, conversation, question, answer, permission result, source references, status, and escalation flag.
