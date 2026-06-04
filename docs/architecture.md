# AppFolio AI Architecture

AppFolio remains the source of record for maintenance data. The local system stores normalized context, inbound messages, AI recommendations, approval state, and audit logs.

```txt
AppFolio Maintenance Data
        |
Backend Sync Layer
        |
PostgreSQL + Redis
        |
AI Context Builder
        |
Structured AI Recommendation
        |
Human Approval Dashboard
        |
Copy-Ready Reply or Optional Email/SMS
        |
Audit Log
```

## Phase 1 Boundaries

- AI responses are recommendations only.
- Human approval is required before communication leaves the system.
- Notes beginning with `#` are owner-only/internal and are filtered from tenant/vendor AI context.
- Email and SMS providers are modular and optional for Phase 1.
