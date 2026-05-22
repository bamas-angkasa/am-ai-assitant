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
- AppFolio-style mock users, profiles, properties, units, tenants, owners, HOA members, leases, payments, work orders, vendors, invoices, attachments, communications, announcements, and live chat escalations
- Local intent detection and entity extraction
- Permission-first data filtering
- Natural-language assistant answers based only on allowed data
- Refusals for unauthorized private data
- Live agent handoff for emergencies, complaints, disputes, and missing data
- Import/export JSON data context from the left sidebar to swap demo records without code changes
- Light and dark mode responsive UI
