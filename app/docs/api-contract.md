# API Contract

## Health

`GET /health`

```json
{ "status": "ok" }
```

## Chat

`POST /chat`

```json
{
  "userId": "tenant_001",
  "role": "tenant",
  "conversationId": "conv_001",
  "message": "How much rent do I owe?"
}
```

Response:

```json
{
  "conversationId": "conv_001",
  "answer": "You currently owe $1250 for May 2026 rent. Your due date is 2026-05-25.",
  "sources": [{ "type": "rent_balance", "id": "rent_001" }],
  "auditId": "audit_001",
  "escalationRequired": false,
  "permission": {
    "allowed": true,
    "reason": "Allowed context is filtered to the selected user's role and property scope."
  }
}
```

## Initial Endpoints

- `GET /health`
- `POST /auth/mock-login`
- `GET /auth/me`
- `GET /roles`
- `GET /properties`
- `GET /properties/:id`
- `POST /chat`
- `GET /conversations`
- `GET /conversations/:id`
- `GET /audit-logs`
- `GET /admin/overview`
- `GET /admin/escalations`
- `POST /maintenance-requests`
- `GET /maintenance-requests`
- `POST /escalations`
