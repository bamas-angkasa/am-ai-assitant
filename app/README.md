# AI Asset Management Assistant

A demo-ready AI assistant platform for property management companies. The backend is the authority layer for user roles, property data filtering, permissions, conversation history, audit logs, escalations, and future AppFolio/PMS integration.

Core rule:

```txt
Filter data first. Check permission second. Ask Claude third. Audit everything.
```

## Structure

```txt
app/
  frontend/   Next.js App Router frontend
  backend/    Golang REST API
  docs/       Product, architecture, API, and demo docs
```

## Run Locally

Backend:

```bash
cd app/backend
go run ./cmd/server
```

Frontend:

```bash
cd app/frontend
pnpm install
pnpm dev
```

Docker:

```bash
cd app
docker compose up
```

## Demo URLs

- Frontend: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin`
- Backend health: `http://localhost:8080/health`

## Audit Requirement

Every `POST /chat` request creates an audit log entry, including successful answers, permission denials, missing-data fallbacks, and escalations.
