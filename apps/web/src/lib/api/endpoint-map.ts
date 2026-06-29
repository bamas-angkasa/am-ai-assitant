export const apiEndpoints = {
  health: "/health",
  workOrders: "/api/v1/work-orders",
  workOrder: (id: string) => `/api/v1/work-orders/${id}`,
  workOrderTimeline: (id: string) => `/api/v1/work-orders/${id}/timeline`,
  recommendations: "/api/v1/recommendations",
  recommendation: (id: string) => `/api/v1/recommendations/${id}`,
  refreshRecommendation: (id: string) => `/api/v1/recommendations/${id}/regenerate`,
  approveRecommendation: (id: string) => `/api/v1/recommendations/${id}/approve`,
  rejectRecommendation: (id: string) => `/api/v1/recommendations/${id}/reject`,
  copyRecommendation: (id: string) => `/api/v1/recommendations/${id}/copy-events`,
  markManualSent: (id: string) => `/api/v1/recommendations/${id}/manual-send-events`,
  auditEvents: "/api/v1/audit-events",
  syncRuns: "/api/v1/sync-runs",
  integrationHealth: "/api/v1/integration-health",
  unmatchedMessages: "/api/v1/messages/unmatched",
  matchMessage: (id: string) => `/api/v1/messages/${id}/match`
} as const;
