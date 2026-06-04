# AppFolio AI API Notes

## Health

```txt
GET /healthz
```

## Work Orders

```txt
GET /api/work-orders
GET /api/work-orders/{id}
POST /api/work-orders/{id}/sync
```

## Messages

```txt
GET /api/messages
GET /api/messages/{id}
POST /api/messages/{id}/match-work-order
```

## AI Recommendations

```txt
POST /api/ai/recommendations
GET /api/ai/recommendations/{id}
```

## Approvals

```txt
POST /api/approvals/{recommendationId}/approve
POST /api/approvals/{recommendationId}/reject
POST /api/approvals/{recommendationId}/edit
```

## Audit Logs

```txt
GET /api/audit-logs
```
