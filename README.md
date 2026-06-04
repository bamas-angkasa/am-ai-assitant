# AppFolio AI Monorepo

Phase 1 scaffold for an AI-assisted AppFolio maintenance inbox. The current frontend demo is preserved as the starting UI, and the backend scaffold contains the first safety-critical modules for owner-only notes, message matching, AI recommendation validation, approval state, and audit logging.

## Structure

```txt
apps/frontend   Next.js, React, TypeScript, Tailwind
apps/backend    Go API, worker, sync scaffold, migrations
docs            Product, architecture, API, and deployment notes
```

## Run Locally

Install frontend dependencies from the repository root:

```bash
npm install
npm run dev
```

Run backend checks from the repository root:

```bash
npm run backend:test
```

Start local services:

```bash
docker compose up -d postgres redis
```

Frontend runs at `http://localhost:3000`. Backend defaults to `http://localhost:8080`.

## Docs

- [AppFolio AI product plan](docs/appfolio-ai.md)
- [Architecture](docs/architecture.md)
- [API notes](docs/api.md)
- [Deployment notes](docs/deployment.md)
