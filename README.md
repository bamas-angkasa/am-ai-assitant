# Dian AI Assistant

A production-quality local demo for a property management AI assistant. It shows how tenants, owners, HOA/board members, building owners, and admins can ask questions while the assistant filters data by role before generating an answer.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## What it demonstrates

- Role-aware user selection
- Mock property, unit, lease, payment, issue, and announcement data
- Local intent detection and entity extraction
- Permission-first data filtering
- Natural-language assistant answers based only on allowed data
- Refusals for unauthorized private data
- Live agent handoff for emergencies, complaints, disputes, and missing data
- Light and dark mode responsive UI
