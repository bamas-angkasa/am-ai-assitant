# AppFolio AI Deployment Notes

## Local

- Frontend: `npm run dev`
- Backend: run from `apps/backend` with `go run ./cmd/api`
- Services: `docker compose up -d postgres redis`

## Staging

- Use test AppFolio credentials or sandbox data when available.
- Use test AI, email, and SMS credentials.
- Run migrations against a staging PostgreSQL database before UAT.

## Production

- Store secrets in the platform secret manager.
- Enable monitoring for API, worker, database, Redis, and provider webhooks.
- Back up PostgreSQL.
- Keep outbound email/SMS disabled until approval/audit behavior is verified.
