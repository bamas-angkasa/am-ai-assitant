# AppFolio Maintenance AI Assistant - UI Enhancement Plan

**Status:** Proposed implementation plan  
**Scope:** Phase 1 internal maintenance operations dashboard  
**Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS  

## 1. Goal

Turn the current single-screen prototype into a polished, responsive, contract-first operations dashboard for property managers and maintenance staff. The UI must support work-order review, AI draft approval, manual message matching, audit review, sync monitoring, and settings without adding automatic outbound messaging.

The existing visual direction remains: a calm light-mode SaaS interface with soft indigo accents, white cards, subtle borders and shadows, rounded controls, consistent status badges, and clear operational hierarchy.

## 2. Current State and Gaps

The repository currently has:

- One production-facing route at `/`, rendering a monolithic `MaintenanceDashboard` client component.
- Two work orders and recommendation logic imported directly from `@appfolio-ai/core`.
- Review actions stored only inside the dashboard component.
- Reusable `Button`, `Badge`, and `Card` primitives that can be retained and extended.
- No operational shell, sidebar navigation, route-level pages, API abstraction, loading states, empty states, or responsive tablet navigation.
- Legacy Dian chatbot code under `/demo`, which remains separate from the Phase 1 dashboard.

The enhancement will preserve useful primitives and the existing color direction while replacing the monolithic dashboard and direct demo-domain dependency.

## 3. Information Architecture and Routes

Create an operational route group with one shared shell:

```text
app/
├── page.tsx                         # Redirect to /dashboard
├── (operations)/
│   ├── layout.tsx                  # App shell + mock data provider
│   ├── dashboard/page.tsx
│   ├── work-orders/[id]/page.tsx
│   ├── manual-matching/page.tsx
│   ├── audit-log/page.tsx
│   ├── sync-health/page.tsx
│   └── settings/page.tsx
└── demo/page.tsx                   # Existing legacy demo, unchanged
```

The shared shell provides:

- Desktop sidebar with the six operational destinations.
- Collapsible/tablet navigation drawer.
- Top bar with page context, AppFolio health, notification placeholder, and current user.
- Consistent page width, responsive gutters, background, and skip-to-content behavior.

## 4. Design System and Reusable Components

### Foundations

- Consolidate semantic color, radius, shadow, spacing, focus, and typography tokens in Tailwind/CSS variables.
- Retain indigo as the primary action color; reserve red for destructive/urgent states, amber for warnings, emerald for healthy/approved states, and slate for neutral states.
- Standardize cards to a small set of variants rather than repeating glass-card class strings.
- Extend buttons with consistent disabled, loading, icon, and destructive states.
- Extend badges through domain wrappers so status-to-color rules are defined once.
- Use visible focus rings, keyboard-accessible controls, non-color status labels, and minimum touch targets.

### Component groups

```text
components/
├── app-shell/          AppShell, SidebarNav, MobileNav, TopBar
├── page/               PageHeader, PageSection, EmptyState, LoadingState
├── status/             StatusBadge, PriorityBadge, ConfidenceBadge, SyncHealthBadge
├── work-orders/        InboxStats, InboxFilters, WorkOrderList, WorkOrderCard,
│                       WorkOrderHeader, WorkOrderContextTabs
├── recommendations/    AIRecommendationPanel, DraftReviewPanel, SafetyFlags,
│                       SourceContextList
├── timeline/           Timeline, TimelineItem
├── appfolio/            AppFolioContextCard, GuardrailsCard, SyncStatusCard
├── manual-matching/    ManualMatchingTable, SuggestedMatches
├── audit/              AuditLogTable, AuditEventDetail
└── sync-health/        SyncHealthOverview, SyncEntityTable, SyncEventTimeline
```

Large domain components compose smaller presentational components. Visual components receive typed data and callbacks; they do not import mock records or call endpoints directly.

## 5. Contract and Data Architecture

Create:

```text
lib/
├── types/              Backend-aligned domain and DTO types
├── api/
│   ├── maintenance-api.ts    Interface used by the application
│   ├── mock-client.ts         Phase 1 demo implementation
│   ├── fetch-client.ts        Real HTTP adapter, prepared but not enabled
│   └── endpoint-map.ts        Centralized API paths
├── mock/
│   ├── fixtures.ts
│   └── mock-store.ts
└── state/
    └── maintenance-provider.tsx
```

Define contract types for work orders, details, notes, messages, attachments, recommendations, revisions, safety flags, source references, timeline events, audit events, sync runs, sync entities, AppFolio context, and manual-match candidates.

Contract decisions:

- Work-order lifecycle remains `open`, `in_progress`, `waiting_vendor`, `waiting_tenant`, `resolved`, or `closed`.
- `is_stale`, `needs_manual_match`, and `has_internal_context` are derived flags, not lifecycle statuses.
- Recommendation review status remains `queued`, `processing`, `ready_for_review`, `approved`, `rejected`, or `failed`.
- Copy and manual-send tracking use delivery state/events rather than replacing review status.
- Internal notes carry explicit visibility and exclusion reason fields.
- All identifiers, timestamps, pagination/filter DTOs, and action payloads match the planned backend shape.

`MaintenanceApi` exposes asynchronous methods mirroring the backend operations:

- Work orders: list, get detail, get timeline.
- Recommendations: list, get, regenerate, edit draft, approve, reject, record copy, record manual send.
- Manual matching: list unmatched messages and confirm a match.
- Audit and operations: list audit events, list sync runs, and get integration health.

The mock client and future fetch client implement the same interface. The provider owns demo state so actions remain visible across operational routes. Every mock mutation updates the recommendation, appends timeline/audit events, and returns a Promise like the future backend client.

## 6. Page Designs

### Dashboard

Use a dense but breathable operations layout:

- Header and four summary cards: Ready for Review, High/Urgent, Internal Context, Needs Manual Match.
- Filter/search row with the eight required operational filters.
- Desktop master-detail layout: inbox list, selected work-order/recommendation workspace, and context/guardrails rail.
- Tablet layout stacks the selected work order below the inbox and moves context into collapsible cards.
- Work-order cards show title, AppFolio ID, property/unit, priority, status, recommendation state, latest inbound preview, and relative update time.
- Selected preview shows work-order header, AI summary, editable draft, safety/source context, guarded actions, and recent timeline.

### Work-order detail

- Full header with work-order metadata and sync freshness.
- Accessible tabs for Overview, Notes, Messages, Attachments, History, and AI Activity.
- Overview combines AppFolio context, AI recommendation, guardrails, and approval history.
- Internal notes use a distinct protected style and explicitly state that they are excluded from tenant/vendor drafts.
- Missing attachments or other data use intentional empty states.

### Manual matching

- Responsive table/card view of unmatched messages.
- Sender, channel, received time, preview, confidence, suggested work orders, and review status.
- Match confirmation updates the row, adds audit/timeline events, and queues a mock recommendation state.

### Audit log

- Filterable table for date, actor, event type, work order, recommendation, and context-exclusion indicator.
- Expandable event detail shows safe before/after summaries without exposing secrets.
- Includes generation, edit, approval, rejection, copy, manual send, regeneration, and manual-match events.

### Sync health

- Operational metrics for last success, duration, processed/failed records, queue depth, AI failures, DLQ count, and rate-limit balance.
- Entity table for all required AppFolio entities.
- Recent sync timeline with success, partial, running, and failed states.

### Settings

- Organization summary, masked AppFolio integration status, sync frequency placeholder, AI provider placeholder, and role/access summary.
- Phase 1 guardrail section.
- Automatic sending appears only as a disabled control labeled `Not available in Phase 1`.

## 7. Recommendation Interaction Rules

- Draft editing is allowed while a recommendation is ready for review.
- Approve saves the current edited draft as the approved revision.
- Reject requests a reason and prevents copy/manual-send actions.
- Regenerate is enabled for failed or rejected recommendations and creates a new audit event.
- `Copy Approved Draft` is disabled until approval; it copies only the approved revision and records a copy event.
- `Mark Manually Sent` is disabled until approval and records channel/time without sending anything.
- Buttons show pending state to prevent duplicate actions.
- Action results are announced accessibly and reflected immediately in badges and timeline.
- There is no `Send` CTA, outbound transport, or automatic action anywhere in Phase 1.

## 8. Mock Scenarios

Fixtures will include:

1. Kitchen sink leak waiting on Bay Area Plumbing with a protected owner note.
2. AC not cooling at Unit 305 with Cool Air HVAC.
3. Bedroom lock issue at Unit 203 with SecureLock Services.
4. Urgent active water intrusion requiring escalation.
5. Low-confidence unmatched inbound message.
6. Stale vendor follow-up case.
7. Failed AI recommendation eligible for regeneration.
8. Recently approved recommendation with copy/manual-send progression.

Use Vantage Residence Apartment and the requested tenant/vendor names. Internal owner context appears only in protected notes and excluded-source UI, never inside tenant/vendor drafts.

## 9. Implementation Sequence

1. Add contract types, realistic fixtures, API interface, mock client, and shared state provider.
2. Refine design tokens and reusable UI primitives; build the operational shell and navigation.
3. Replace `/` with a redirect and build the `/dashboard` master-detail experience.
4. Build `/work-orders/[id]` with tabs, context, recommendation workflow, and timeline.
5. Build `/manual-matching` and its local match transition.
6. Build `/audit-log` with filtering and expandable details.
7. Build `/sync-health` and `/settings`.
8. Remove the obsolete monolithic maintenance dashboard after its useful behavior has been migrated.
9. Run typecheck, lint, and production build; fix all failures.
10. Visually verify desktop and tablet breakpoints, keyboard navigation, empty/loading states, action gating, and absence of any Send CTA.

## 10. Verification and Acceptance

- All six required routes render inside one consistent operational shell.
- `/dashboard` is stakeholder-demo ready at desktop and tablet widths.
- Components consume the `MaintenanceApi` boundary rather than fixture imports.
- All eight mock scenarios conform to contract types.
- Approval, rejection, regeneration, copying, manual-send marking, and manual matching update mock state and audit/timeline records.
- Copy and manual-send controls obey approval rules; rejected drafts cannot be copied.
- Internal notes and excluded context are clearly marked and absent from audience drafts.
- No Send button or outbound implementation exists.
- Loading, empty, failure, hover, focus, and disabled states are present.
- TypeScript, lint, and production build pass.
- Existing `/demo` behavior remains available and isolated from the operations dashboard.

