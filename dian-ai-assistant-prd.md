# Product Requirements Document

## Dian AI Assistant — Property Management AI Assistant Demo

**Document Owner:** Bamas Angkasa  
**Client Stakeholders:** Paul, Caleb  
**Product:** Dian AI Assistant  
**Project Type:** AI Assistant Demo / Property Management Support  
**Version:** v1.0  
**Status:** Draft for Demo Planning  
**Target Demo Timeline:** 1–2 Days  
**Primary Goal:** Demonstrate an AI Assistant that can answer property-related questions using mock AppFolio-style data while respecting user roles and access permissions.

---

## 1. Executive Summary

Dian AI Assistant is a demo AI Assistant for a property management business owned by Paul, with Caleb leading the digitalization initiative.

The business currently receives many phone calls, texts, and emails from tenants, owners, and building representatives. One key pain point is that users often complain because they call the office but no one answers. This creates delays, repeated follow-ups, and manual work for the internal team.

The goal of this demo is to show how an AI Assistant can help users get faster answers about rent, leases, maintenance issues, building updates, and property information.

For the initial demo, the assistant will not connect to real AppFolio data yet. Instead, it will use mock AppFolio-style property management data to simulate how the system would work in production.

The most important value of the demo is not just answering questions, but answering questions **safely** based on each user’s identity and permission scope.

For example:

- A tenant can only access their own unit, payment, lease, and maintenance request.
- A unit owner can access only the units they own.
- A HOA or Board member can access common area and building maintenance information, but not private tenant financial data.
- A building owner can access building-level summaries.
- An internal admin can access broader operational data.

The demo should also include a live agent handoff flow for urgent, sensitive, unresolved, or complaint-based conversations.

---

## 2. Background

Paul owns the property management company, and Caleb wants to improve the business process through digitalization.

The company helps manage residential properties, apartments, units, owners, tenants, and building-related operations. Users may include tenants, individual unit owners, building owners, HOA or Board members, and internal property management staff.

The current communication flow relies heavily on phone calls, texts, and emails. Because many users call and do not always get immediate responses, there is an opportunity to improve support availability using an AI Assistant.

The AI Assistant should act as the first layer of support. It should help answer common questions, check issue status, summarize property data, and direct users to a live agent when needed.

In the future, the system may connect to AppFolio. However, for this demo, AppFolio integration will be simulated using mock data.

---

## 3. Problem Statement

The business receives many user questions and support requests through phone, text, and email. Some users complain because they call but no one answers. This creates several issues:

- Users do not get timely updates.
- Internal staff must manually respond to repeated questions.
- Tenants, owners, and building representatives may ask for different types of information.
- Sensitive data must not be exposed to the wrong user.
- The company needs a scalable support layer that can provide fast answers while respecting access control.

The core challenge is:

> How might we help tenants, owners, HOA/Board members, and internal staff get accurate property-related answers faster, while ensuring each user only sees the data they are allowed to access?

---

## 4. Product Objective

The objective of Dian AI Assistant is to provide a demo of a secure, role-aware AI Assistant for property management.

The demo must prove that the assistant can:

1. Identify the current user.
2. Understand the user’s question.
3. Detect the user’s role.
4. Determine the user’s allowed data scope.
5. Retrieve only permitted data.
6. Answer safely and clearly.
7. Refuse unauthorized questions.
8. Offer live agent handoff when needed.

The demo should be simple, polished, responsive, and easy to present to Paul and Caleb.

---

## 5. Demo Scope

### 5.1 In Scope

The demo will include:

- Mock user identity selector.
- Role-based access control.
- Mock AppFolio-style property data.
- AI Assistant chat interface.
- Suggested questions by role.
- Intent detection.
- Entity extraction.
- Permission checking.
- Safe answer generation.
- Unauthorized access refusal.
- Emergency and complaint handling.
- Live agent handoff mock.
- Assistant reasoning/debug panel for demo visibility.
- Light mode and dark mode UI.
- Responsive layout for desktop and mobile.

### 5.2 Out of Scope for Demo

The following are not required for the 1–2 day demo:

- Real AppFolio API integration.
- Real authentication.
- Real database.
- Real SMS integration.
- Real email integration.
- Real live chat provider integration.
- Real payment processing.
- Real maintenance vendor dispatching.
- Real document upload or document parsing.
- Multi-building production-grade permission model.
- Production deployment hardening.
- Long-term conversation history.
- Admin dashboard for data management.

---

## 6. Target Users

### 6.1 Tenant

A tenant rents one unit in a property or apartment building.

**Example user:** John Miller rents Unit 101.

**Tenant needs:**

- Check rent balance.
- Check lease information.
- Check maintenance issue status.
- Report complaint.
- Ask building-related questions.
- Reach live agent when needed.

**Tenant restrictions:**

- Cannot access other tenants’ payments.
- Cannot access other tenants’ maintenance issues.
- Cannot access owner reports.
- Cannot access full building financial data.

### 6.2 Unit Owner

A unit owner owns one or more individual units in an apartment building, but not the full building.

**Example user:** Sarah Johnson owns Unit 101 and Unit 102.

**Unit owner needs:**

- View owned unit status.
- View tenant occupancy for owned units.
- View maintenance issues in owned units.
- View rent/payment summary for owned units.

**Unit owner restrictions:**

- Cannot access units owned by other owners.
- Cannot access unrelated building-level financials.
- Cannot access private data outside their owned units.

### 6.3 HOA / Board Member

A HOA or Board member is not necessarily the full owner, but acts as a building representative or community manager. This is similar to a building “RT” or selected representative.

**Example user:** Michael Brown is a HOA Board member for Vantage Residence Apartment.

**HOA needs:**

- View common area issues.
- View building maintenance updates.
- View safety issues.
- View building announcements.

**HOA restrictions:**

- Cannot access private tenant payment details.
- Cannot access private tenant lease details.
- Cannot access personal documents.
- Cannot access owner-specific financial reports unless explicitly permitted.

### 6.4 Building Owner

A building owner owns the full apartment or building.

**Example user:** Paul Anderson owns Vantage Residence Apartment.

**Building owner needs:**

- View building summary.
- View occupancy summary.
- View vacant units.
- View rent summary.
- View all maintenance issues in their building.
- View common area and private unit issue summaries.

**Building owner restrictions:**

- Cannot access unrelated buildings.
- Should not access internal company data unrelated to their building.

### 6.5 Internal Admin

Internal admin is part of the property management company.

**Example user:** Dian Property Admin.

**Admin needs:**

- Access all mock operational data.
- View tenants, owners, units, payments, leases, issues, and building summaries.
- Handle escalations.

**Admin restrictions:**

- Sensitive legal, payment dispute, or contract questions should still be escalated carefully.

---

## 7. Product Positioning

### 7.1 Product Name

Dian AI Assistant

### 7.2 Product Description

Dian AI Assistant is an AI-powered support assistant for property management teams. It helps tenants, owners, HOA boards, and property managers get fast answers about rent, leases, maintenance issues, building updates, and property operations while protecting sensitive data through role-based access control.

### 7.3 Demo Tagline

**AI assistant for tenants, owners, HOA boards, and property managers.**

### 7.4 Value Proposition

Dian AI Assistant helps reduce missed calls and repetitive support questions by allowing users to ask property-related questions directly while ensuring that each user only receives information they are authorized to access.

---

## 8. Goals and Success Criteria

### 8.1 Business Goals

- Reduce missed call frustration.
- Reduce repetitive support workload.
- Improve tenant and owner response time.
- Create a foundation for property management digitalization.
- Demonstrate how AI can safely work with AppFolio-style data.
- Provide a path toward future AppFolio integration.

### 8.2 Demo Goals

The demo should clearly show:

- Tenant can ask about their own rent.
- Tenant can check their own maintenance issue.
- Tenant cannot access another tenant’s data.
- HOA can access common area maintenance data.
- HOA cannot access tenant payment data.
- Unit owner can access owned unit information.
- Building owner can access building-level summaries.
- Admin can access broader operational data.
- Live agent handoff is available.
- Assistant reasoning panel shows how the system makes decisions.

### 8.3 Success Criteria

The demo is successful if Paul and Caleb can understand that:

- Dian AI Assistant is not a generic chatbot.
- It understands property management scenarios.
- It identifies the user role.
- It applies permission checks before answering.
- It protects sensitive data.
- It can reduce unanswered call pressure.
- It can escalate unresolved issues to a human agent.
- It can later be connected to AppFolio or another real property management system.

---

## 9. User Roles and Permissions

### 9.1 Permission Matrix

| Role | Can Access | Cannot Access |
|---|---|---|
| Tenant | Own unit, own lease, own payment, own issues, building announcements | Other tenant data, owner reports, full building financials |
| Unit Owner | Owned units, tenants in owned units, issues in owned units, rent summary for owned units | Other owners’ units, unrelated tenant data, full building data if not owner |
| HOA / Board | Common area issues, building maintenance, safety issues, announcements | Private tenant payments, private leases, personal documents |
| Building Owner | All units in owned building, maintenance issues, occupancy, rent summary | Other buildings, unrelated internal company data |
| Admin | All mock operational data | Sensitive legal or contract issues should still be escalated |

---

## 10. User Journey Overview

### 10.1 Global User Journey

1. User opens Dian AI Assistant.
2. User is identified or selected.
3. System loads the user role.
4. System loads the user’s access scope.
5. User asks a question.
6. Assistant detects the intent.
7. Assistant extracts relevant entities.
8. System checks permissions.
9. System retrieves allowed data only.
10. Assistant answers safely.
11. If needed, assistant offers live agent handoff.

---

## 11. Core Use Cases

### Use Case 1: Tenant Checks Rent Balance

**User:** John Miller — Tenant  
**Question:** “How much rent do I owe?”

**Expected Logic:**

1. Identify John as Tenant.
2. Detect intent: `check_payment_balance`.
3. Retrieve only John’s payment data.
4. Return payment summary.

**Expected Answer:**

> For May 2026, your rent amount is $1,800. You have paid $1,000, so your outstanding balance is $800.

**Permission Rule:** Tenant can access only their own payment information.

### Use Case 2: Tenant Checks Own Issue Status

**User:** John Miller — Tenant  
**Question:** “What is the status of issue ISS-1001?”

**Expected Logic:**

1. Identify John as Tenant.
2. Detect intent: `check_issue_status`.
3. Extract issue ID: `ISS-1001`.
4. Confirm issue belongs to John or Unit 101.
5. Return issue status.

**Expected Answer:**

> Your issue ISS-1001, “Kitchen sink leaking”, is currently in progress. The technician is scheduled for May 24, 2026 between 10 AM and 12 PM.

**Permission Rule:** Tenant can access only issues linked to their own unit/account.

### Use Case 3: Tenant Tries to Access Another Tenant’s Issue

**User:** John Miller — Tenant  
**Question:** “What is the status of issue ISS-1002?”

**Expected Logic:**

1. Identify John as Tenant.
2. Extract issue ID: `ISS-1002`.
3. System finds `ISS-1002` belongs to Emma Wilson / Unit 102.
4. Deny access.

**Expected Answer:**

> I’m sorry, I can’t access that issue because it is not linked to your unit or account.

**Permission Rule:** Tenant cannot access another tenant’s issue data.

### Use Case 4: Tenant Tries to Access Another Tenant’s Rent

**User:** John Miller — Tenant  
**Question:** “How much does Emma in Unit 102 owe?”

**Expected Logic:**

1. Identify John as Tenant.
2. Detect intent: `check_payment_balance`.
3. Extract Emma / Unit 102.
4. System checks payment ownership.
5. Deny access.

**Expected Answer:**

> I’m sorry, I can’t share another tenant’s rent or payment information.

**Permission Rule:** Tenant cannot access another tenant’s financial information.

### Use Case 5: Tenant Checks Lease Information

**User:** John Miller — Tenant  
**Question:** “When does my lease end?”

**Expected Logic:**

1. Identify John as Tenant.
2. Detect intent: `check_lease_info`.
3. Retrieve Lease 001.
4. Return lease end date.

**Expected Answer:**

> Your current lease for Unit 101 ends on June 30, 2026.

**Permission Rule:** Tenant can access only their own lease.

### Use Case 6: Complaint About Missed Calls

**User:** Any user, usually Tenant  
**Question:** “I called many times but nobody answered.”

**Expected Logic:**

1. Detect `complaint_followup` intent.
2. Respond empathetically.
3. Offer help.
4. Offer live agent handoff.

**Expected Answer:**

> I’m sorry you couldn’t reach the team by phone. I can help check your request here. Would you like me to connect you with a live agent?

**Escalation:** Show “Connect to Live Agent” button.

### Use Case 7: Emergency Issue

**User:** Tenant  
**Question:** “There is water flooding in my apartment.”

**Expected Logic:**

1. Detect `emergency_issue` intent.
2. Classify as urgent.
3. Recommend immediate escalation.
4. Offer live agent handoff.

**Expected Answer:**

> This sounds urgent. I recommend contacting emergency maintenance immediately. I can also connect you with a live agent now to help escalate this issue.

**Escalation:** Live agent handoff should be shown immediately.

### Use Case 8: HOA Checks Common Area Issue

**User:** Michael Brown — HOA Board  
**Question:** “What is the status of the elevator issue?”

**Expected Logic:**

1. Identify Michael as HOA Board.
2. Detect issue/maintenance intent.
3. Extract elevator keyword.
4. Confirm elevator issue is common area/building maintenance.
5. Return issue update.

**Expected Answer:**

> The elevator issue is currently in progress. Inspection has been completed, and the replacement part has been ordered.

**Permission Rule:** HOA can access building/common area maintenance data.

### Use Case 9: HOA Tries to Access Tenant Payment

**User:** Michael Brown — HOA Board  
**Question:** “How much rent does John in Unit 101 owe?”

**Expected Logic:**

1. Identify Michael as HOA Board.
2. Detect payment intent.
3. System checks HOA restrictions.
4. Deny private payment data.

**Expected Answer:**

> I’m sorry, I can’t share private tenant payment details. I can only help with building operations, common area issues, and maintenance-related information.

**Permission Rule:** HOA cannot access private tenant payment data.

### Use Case 10: Unit Owner Checks Owned Unit Status

**User:** Sarah Johnson — Unit Owner  
**Question:** “Show me the status of my units.”

**Expected Logic:**

1. Identify Sarah as Unit Owner.
2. Retrieve Unit 101 and Unit 102.
3. Return status for only owned units.

**Expected Answer:**

> You currently own 2 units in Vantage Residence Apartment. Unit 101 is occupied by John Miller with monthly rent of $1,800. Unit 102 is occupied by Emma Wilson with monthly rent of $1,750.

**Permission Rule:** Unit owner can access only owned units.

### Use Case 11: Unit Owner Checks Issues in Owned Units

**User:** Sarah Johnson — Unit Owner  
**Question:** “Are there any open maintenance issues in my units?”

**Expected Logic:**

1. Identify Sarah as Unit Owner.
2. Retrieve issues linked to Unit 101 and Unit 102.
3. Return issue summary.

**Expected Answer:**

> Yes, there are 2 maintenance issues linked to your units: ISS-1001 for Unit 101, Kitchen sink leaking, currently in progress; and ISS-1002 for Unit 102, Bedroom light not working, currently open.

**Permission Rule:** Unit owner can access maintenance issues for owned units only.

### Use Case 12: Building Owner Checks Building Summary

**User:** Paul Anderson — Building Owner  
**Question:** “Give me a summary of my apartment building.”

**Expected Logic:**

1. Identify Paul as Building Owner.
2. Retrieve Building 001 summary.
3. Return occupancy, issue, and rent summary.

**Expected Answer:**

> Vantage Residence Apartment has 20 total units, 18 occupied units, 2 vacant units, 3 open maintenance issues, and $800 outstanding rent based on available demo payments.

**Permission Rule:** Building owner can access summary for owned building only.

### Use Case 13: Building Owner Checks Open Maintenance Issues

**User:** Paul Anderson — Building Owner  
**Question:** “Show all open maintenance issues.”

**Expected Logic:**

1. Identify Paul as Building Owner.
2. Retrieve all open or in-progress issues in Building 001.
3. Return issue list.

**Expected Answer:**

> There are 3 open or in-progress maintenance issues in your building: ISS-1001, Kitchen sink leaking in Unit 101; ISS-1002, Bedroom light not working in Unit 102; and ISS-2001, elevator making loud noise in the common area.

**Permission Rule:** Building owner can access building-level maintenance information.

### Use Case 14: Admin Checks All Unresolved Issues

**User:** Dian Property Admin — Admin  
**Question:** “Show all unresolved maintenance issues.”

**Expected Logic:**

1. Identify user as Admin.
2. Retrieve all unresolved issues.
3. Return issue list.

**Expected Answer:**

> There are 3 unresolved maintenance issues: ISS-1001, ISS-1002, and ISS-2001.

**Permission Rule:** Admin can access all mock operational data.

### Use Case 15: Unknown Issue ID

**User:** Any role  
**Question:** “What is the status of issue ISS-9999?”

**Expected Logic:**

1. Detect `check_issue_status` intent.
2. Extract issue ID `ISS-9999`.
3. Search allowed data.
4. No matching record found.
5. Offer escalation.

**Expected Answer:**

> I couldn’t find issue ISS-9999 in the available records. Would you like me to connect you with a live agent?

**Rule:** Assistant must not hallucinate missing data.

### Use Case 16: User Requests Live Agent

**User:** Any role  
**Question:** “Can I talk to a real person?”

**Expected Logic:**

1. Detect `request_live_agent` intent.
2. Show live agent CTA.

**Expected Answer:**

> Of course. I can connect you with a live agent.

**Rule:** User should always be able to reach human support.

### Use Case 17: Out-of-Scope Question

**User:** Any role  
**Question:** “Can you recommend a restaurant nearby?”

**Expected Logic:**

1. Detect `out_of_scope` intent.
2. Redirect to property-related support.

**Expected Answer:**

> I’m here to help with property-related questions such as rent, lease, maintenance, building updates, and support requests.

**Rule:** Assistant should stay focused on property management support.

### Use Case 18: Building Announcement

**User:** Tenant, HOA, Unit Owner, Building Owner, Admin  
**Question:** “Are there any building announcements?”

**Expected Logic:**

1. Identify user’s building access.
2. Retrieve announcements for related building.
3. Return only relevant announcements.

**Expected Answer:**

> There is one building announcement: Scheduled Lobby Cleaning. Lobby deep cleaning is scheduled for May 25, 2026 from 8 AM to 11 AM.

**Permission Rule:** Users receive announcements only for buildings they are connected to.

---

## 12. Functional Requirements

### 12.1 User Selector

The demo must allow switching between mock users.

**Users:**

- Dian Property Admin — Admin.
- Paul Anderson — Building Owner.
- Michael Brown — HOA Board.
- Sarah Johnson — Unit Owner.
- John Miller — Tenant.
- Emma Wilson — Tenant.

When a user is selected, the UI must update:

- User name.
- Role.
- Allowed scope.
- Suggested questions.
- Debug panel context.

### 12.2 Chat Interface

The app must provide a chat interface where users can type questions.

**Requirements:**

- User messages align right.
- Assistant messages align left.
- Input field supports Enter to send.
- Suggested questions can be clicked.
- Chat should auto-scroll to the latest message.
- Clear chat button is available.
- Assistant should show loading state before response.
- Chat bubbles should be rounded and iMessage-inspired.

### 12.3 Suggested Questions

Suggested questions should change based on selected role.

**Tenant suggestions:**

- How much rent do I owe?
- What is the status of issue ISS-1001?
- When does my lease end?
- I called many times but nobody answered.
- There is water flooding in my apartment.

**HOA suggestions:**

- What is the status of the elevator issue?
- Show building maintenance issues.
- Is there any safety issue in the building?
- How much rent does John in Unit 101 owe?

**Unit Owner suggestions:**

- Show me the status of my units.
- Are there any open maintenance issues in my units?
- Show rent summary for my units.

**Building Owner suggestions:**

- Give me a summary of my apartment building.
- Show all open maintenance issues.
- Which units are vacant?
- Show outstanding rent summary.

**Admin suggestions:**

- Show all unresolved maintenance issues.
- Show all tenant payment status.
- Show building summary.
- What issues need urgent attention?

### 12.4 Intent Detection

The system must classify user questions into supported intents.

**Supported intents:**

- `check_issue_status`
- `check_payment_balance`
- `check_lease_info`
- `check_unit_status`
- `building_summary`
- `maintenance_summary`
- `building_announcement`
- `complaint_followup`
- `emergency_issue`
- `request_live_agent`
- `out_of_scope`
- `unauthorized_access`

### 12.5 Entity Extraction

The system must extract relevant entities from user questions.

**Entities include:**

- Issue ID, such as `ISS-1001`.
- Unit number, such as `Unit 101`.
- Tenant name, such as John or Emma.
- Building keyword.
- Maintenance keyword.
- Payment keyword.
- Lease keyword.
- Emergency keyword.
- Complaint keyword.

### 12.6 Permission Check

Before answering, the system must check whether the selected user is allowed to access the requested data.

The system should not pass all mock data to the assistant answer generator.

The correct flow is:

1. Detect user.
2. Detect role.
3. Filter allowed data.
4. Check requested entity against allowed data.
5. Generate answer only from permitted data.
6. If denied, return safe refusal.

### 12.7 Answer Generation

The answer should be clear, direct, and professional.

**Recommended answer structure:**

1. Direct answer.
2. Relevant details.
3. Optional next action.

Example:

> Your issue ISS-1001 is currently in progress. The technician is scheduled for May 24, 2026 between 10 AM and 12 PM. Would you like me to connect you with a live agent for more details?

### 12.8 Unauthorized Access Handling

When a user asks for data outside their scope, the assistant must refuse politely.

The assistant should not reveal sensitive details.

Example:

> I’m sorry, I can’t share another tenant’s rent or payment information.

The assistant should redirect to allowed actions.

Example:

> I can help you check your own rent balance or maintenance requests.

### 12.9 Live Agent Handoff

The app must show a “Connect to Live Agent” button when escalation is needed.

Escalation should trigger for:

- Emergency issue.
- Complaint about unanswered calls.
- Payment dispute.
- Legal or contract dispute.
- Data not found.
- User directly asks for human support.
- AI cannot safely answer.

When clicked, the assistant should reply:

> Your conversation has been escalated to the property management team. An agent will follow up shortly.

### 12.10 Assistant Reasoning / Debug Panel

The demo must include a visible debug panel for presentation.

**Panel title:** Assistant Reasoning

The panel should show:

- Selected user.
- Role.
- Detected intent.
- Extracted entities.
- Permission result.
- Reason.
- Data used.
- Escalation needed.

**Example allowed state:**

- Selected User: John Miller.
- Role: Tenant.
- Detected Intent: `check_issue_status`.
- Extracted Entity: `ISS-1001`.
- Permission: Allowed.
- Data Used: Issue `ISS-1001`.
- Escalation: No.

**Example denied state:**

- Selected User: John Miller.
- Role: Tenant.
- Detected Intent: `check_payment_balance`.
- Extracted Entity: Emma Wilson / Unit 102.
- Permission: Denied.
- Reason: Requested data belongs to another tenant.
- Escalation: No.

---

## 13. Non-Functional Requirements

### 13.1 Performance

- The demo should feel instant and responsive.
- AI response simulation should complete within 1–2 seconds.
- The page should load quickly.
- No heavy unnecessary dependencies.

### 13.2 Responsiveness

The UI must work on:

- Desktop.
- Tablet.
- Mobile.

**Desktop layout:**

- Left sidebar for user and suggestions.
- Center chat panel.
- Right reasoning/debug panel.

**Mobile layout:**

- User selector at top.
- Chat full width.
- Debug panel collapsible or displayed below chat.

### 13.3 Accessibility

- Buttons must be keyboard accessible.
- Input must be clearly labeled.
- Color contrast must work in both light and dark mode.
- Text must be readable.
- Interactive elements must have hover and focus states.

### 13.4 Reliability

The assistant should not crash for unknown questions.

The assistant should not hallucinate missing data.

The assistant should always return either:

- A valid answer.
- A safe refusal.
- A live agent handoff suggestion.
- A property-related redirection.

### 13.5 Security Principles

Even though this is a mock demo, the system should be designed around safe access patterns.

Key principle:

> Filter data first, then generate the answer.

The assistant should never receive all data and then decide what to hide. The application layer should determine the user’s allowed data before answer generation.

---

## 14. Mock Data Requirements

### 14.1 Building

- Building ID: `building_001`
- Name: Vantage Residence Apartment
- Address: 120 Collins Street, Melbourne, VIC
- Total units: 20
- Occupied units: 18
- Vacant units: 2
- Facilities:
  - Lobby
  - Parking
  - Elevator
  - Gym
  - Shared Laundry

### 14.2 Units

**Unit 101:**

- Building: `building_001`
- Owner: Sarah Johnson
- Tenant: John Miller
- Status: occupied
- Monthly rent: $1,800
- Lease: `lease_001`

**Unit 102:**

- Building: `building_001`
- Owner: Sarah Johnson
- Tenant: Emma Wilson
- Status: occupied
- Monthly rent: $1,750
- Lease: `lease_002`

**Unit 103:**

- Building: `building_001`
- Owner: Paul Anderson
- Tenant: none
- Status: vacant
- Monthly rent: $1,900
- Lease: none

### 14.3 Tenants

**John Miller:**

- Email: john@example.com
- Phone: +61 400 111 222
- Unit: `unit_101`
- Lease: `lease_001`

**Emma Wilson:**

- Email: emma@example.com
- Phone: +61 400 333 444
- Unit: `unit_102`
- Lease: `lease_002`

### 14.4 Leases

**Lease 001:**

- Tenant: John Miller
- Unit: Unit 101
- Start date: July 1, 2025
- End date: June 30, 2026
- Monthly rent: $1,800
- Deposit: $3,600
- Status: active

**Lease 002:**

- Tenant: Emma Wilson
- Unit: Unit 102
- Start date: September 1, 2025
- End date: August 31, 2026
- Monthly rent: $1,750
- Deposit: $3,500
- Status: active

### 14.5 Payments

**Payment 001:**

- Tenant: John Miller
- Unit: Unit 101
- Period: May 2026
- Amount due: $1,800
- Amount paid: $1,000
- Outstanding balance: $800
- Due date: May 1, 2026
- Status: partially paid

**Payment 002:**

- Tenant: Emma Wilson
- Unit: Unit 102
- Period: May 2026
- Amount due: $1,750
- Amount paid: $1,750
- Outstanding balance: $0
- Due date: May 1, 2026
- Status: paid

### 14.6 Issues

**ISS-1001:**

- Reported by: John Miller
- Unit: Unit 101
- Category: Plumbing
- Scope: private_unit
- Title: Kitchen sink leaking
- Description: Water is leaking under the kitchen sink.
- Status: in_progress
- Priority: medium
- Assigned to: Melbourne Plumbing Services
- Created at: May 18, 2026
- Latest update: Technician scheduled for May 24, 2026 between 10 AM and 12 PM.

**ISS-1002:**

- Reported by: Emma Wilson
- Unit: Unit 102
- Category: Electrical
- Scope: private_unit
- Title: Bedroom light not working
- Description: Main bedroom ceiling light stopped working.
- Status: open
- Priority: low
- Assigned to: none
- Created at: May 19, 2026
- Latest update: Waiting for maintenance team assignment.

**ISS-2001:**

- Reported by: Michael Brown
- Unit: none
- Building: `building_001`
- Category: Building maintenance
- Scope: common_area
- Title: Elevator making loud noise
- Description: The main elevator is making noise between level 2 and 4.
- Status: in_progress
- Priority: high
- Assigned to: Elevator Maintenance Co.
- Created at: May 17, 2026
- Latest update: Inspection completed. Replacement part ordered.

### 14.7 Announcements

**ANN-001:**

- Building: `building_001`
- Title: Scheduled Lobby Cleaning
- Message: Lobby deep cleaning is scheduled for May 25, 2026 from 8 AM to 11 AM.
- Visibility: building

---

## 15. UI Requirements

### 15.1 Visual Direction

The UI should be minimal, polished, and client-demo ready.

**Design style:**

- Clean SaaS interface.
- iMessage-inspired chat.
- Light and dark mode.
- Subtle borders.
- Rounded cards.
- Soft shadows.
- Simple icons.
- Responsive layout.

**Avoid:**

- Overly complex gradients.
- Cartoonish UI.
- Too many colors.
- Heavy animations.
- Unnecessary dashboards.

### 15.2 Main Layout

**Desktop:**

Left panel:

- User selector.
- Role card.
- Allowed scope.
- Suggested questions.

Center panel:

- Chat interface.
- Input field.
- Live agent CTA when needed.

Right panel:

- Assistant Reasoning debug panel.

**Mobile:**

Top section:

- User selector and role.

Main section:

- Chat.

Below chat:

- Suggested questions.
- Collapsible assistant reasoning panel.

### 15.3 Initial Assistant Message

When the page loads, the assistant should say:

> Hi, I’m Dian AI Assistant. I can help with rent, lease, maintenance issues, building updates, and property-related questions. Please select a user role and ask a question.

### 15.4 User Change Behavior

When the selected user changes:

- Update role and scope.
- Update suggested questions.
- Clear debug state or reset it.
- Optionally add system message:

> You are now viewing as John Miller — Tenant.

---

## 16. Technical Requirements

### 16.1 Recommended Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui if available.
- Lucide icons.
- Mock JSON data.
- Local assistant engine.
- No database required.
- No real API integration required.

### 16.2 Suggested File Structure

```txt
src/app/page.tsx
src/components/app-shell.tsx
src/components/user-selector.tsx
src/components/role-card.tsx
src/components/suggested-questions.tsx
src/components/chat-panel.tsx
src/components/chat-message.tsx
src/components/assistant-debug-panel.tsx
src/components/live-agent-button.tsx
src/lib/mock-data.ts
src/lib/assistant-engine.ts
src/lib/access-control.ts
src/lib/types.ts
src/lib/utils.ts
```

### 16.3 Required Types

```txt
UserRole
User
Building
Unit
Tenant
Lease
Payment
Issue
Announcement
AssistantIntent
PermissionResult
AssistantDebugState
ChatMessage
```

### 16.4 Assistant Engine Functions

The local assistant engine should include:

```ts
function detectIntent(question: string): AssistantIntent
function extractEntities(question: string): ExtractedEntities
function getAllowedData(user: User): AllowedData
function checkPermission(user: User, intent: AssistantIntent, entities: ExtractedEntities): PermissionResult
function generateAnswer(
  user: User,
  question: string,
  intent: AssistantIntent,
  entities: ExtractedEntities,
  allowedData: AllowedData,
  permissionResult: PermissionResult
): string
function shouldEscalateToLiveAgent(
  question: string,
  intent: AssistantIntent,
  permissionResult: PermissionResult
): boolean
```

---

## 17. Access Control Logic

### 17.1 Tenant Logic

Tenant can access:

- Own unit.
- Own lease.
- Own payment.
- Own issues.
- Building announcements.

Tenant cannot access:

- Other tenant payments.
- Other tenant issues.
- Other tenant lease.
- Owner financial report.
- Full building operational data.

### 17.2 Unit Owner Logic

Unit owner can access:

- Owned units.
- Tenants in owned units.
- Issues in owned units.
- Rent summary for owned units.

Unit owner cannot access:

- Other owners’ units.
- Unrelated tenant data.
- Full building data if not building owner.

### 17.3 HOA Logic

HOA can access:

- Common area issues.
- Building maintenance issues.
- Safety issues.
- Building announcements.

HOA cannot access:

- Private tenant payment details.
- Private lease details.
- Personal tenant documents.
- Owner-specific financial reports.

### 17.4 Building Owner Logic

Building owner can access:

- Owned building.
- All units in owned building.
- All issues in owned building.
- Occupancy summary.
- Rent summary.
- Maintenance summary.

Building owner cannot access:

- Buildings not owned by them.
- Internal company data unrelated to their building.

### 17.5 Admin Logic

Admin can access:

- All mock operational data.

Admin should escalate:

- Legal disputes.
- Payment disputes.
- Contract disputes.
- Emergency cases.

---

## 18. Escalation Rules

The assistant should offer live agent handoff when:

- User reports an emergency.
- User complains that no one answered the phone.
- User asks for a real person.
- User asks about legal issues.
- User asks about contract disputes.
- User asks about payment disputes.
- Requested data cannot be found.
- Assistant cannot confidently answer.
- Permission is denied but user may still need help.

Example escalation message:

> Would you like me to connect you with a live agent?

After clicking live agent:

> Your conversation has been escalated to the property management team. An agent will follow up shortly.

---

## 19. Demo Script

### 19.1 Opening

> This demo shows Dian AI Assistant, an AI assistant designed for property management communication. The goal is to reduce missed calls and repetitive support questions by allowing tenants, owners, HOA boards, and internal admins to ask questions directly.
>
> The most important part is that the assistant does not answer everything to everyone. It first identifies the user, checks their role, checks what data they are allowed to access, and only then provides an answer.

### 19.2 Scenario 1: Tenant Own Rent

**Select:** John Miller — Tenant.  
**Ask:** “How much rent do I owe?”

**Expected result:** Assistant answers with John’s own outstanding balance.

**Show debug panel:**

- Intent: `check_payment_balance`.
- Permission: Allowed.
- Data used: Payment 001.

### 19.3 Scenario 2: Tenant Own Issue

**Ask:** “What is the status of issue ISS-1001?”

**Expected result:** Assistant answers with John’s own issue status.

**Show debug panel:**

- Permission: Allowed.
- Data used: ISS-1001.

### 19.4 Scenario 3: Tenant Unauthorized Data

**Ask:** “How much does Emma in Unit 102 owe?”

**Expected result:** Assistant refuses.

**Show debug panel:**

- Permission: Denied.
- Reason: Requested data belongs to another tenant.

### 19.5 Scenario 4: HOA Common Area Issue

**Select:** Michael Brown — HOA Board.  
**Ask:** “What is the status of the elevator issue?”

**Expected result:** Assistant answers because elevator issue is common area.

### 19.6 Scenario 5: HOA Private Payment Denied

**Ask:** “How much rent does John in Unit 101 owe?”

**Expected result:** Assistant refuses because HOA cannot access private tenant payment detail.

### 19.7 Scenario 6: Unit Owner Owned Units

**Select:** Sarah Johnson — Unit Owner.  
**Ask:** “Show me the status of my units.”

**Expected result:** Assistant shows Unit 101 and Unit 102 only.

### 19.8 Scenario 7: Building Owner Summary

**Select:** Paul Anderson — Building Owner.  
**Ask:** “Give me a summary of my apartment building.”

**Expected result:** Assistant shows building-level summary.

### 19.9 Scenario 8: Complaint and Live Agent

**Select:** John Miller — Tenant.  
**Ask:** “I called many times but nobody answered.”

**Expected result:** Assistant responds empathetically and offers live agent handoff.

**Click:** Connect to Live Agent.

**Expected result:** Assistant confirms escalation.

---

## 20. Acceptance Criteria

### 20.1 User Selection

- User can switch between all mock roles.
- Selected role updates UI context.
- Suggested questions update based on role.
- Allowed scope is visible.

### 20.2 Chat

- User can ask a question.
- Assistant returns an answer.
- Assistant supports suggested question clicks.
- Chat displays user and assistant messages clearly.
- Chat can be cleared.

### 20.3 Role-Based Access

- Tenant can access own payment.
- Tenant can access own issue.
- Tenant cannot access another tenant’s payment.
- Tenant cannot access another tenant’s issue.
- HOA can access common area issue.
- HOA cannot access tenant payment data.
- Unit owner can access owned units.
- Building owner can access building summary.
- Admin can access all unresolved issues.

### 20.4 Debug Panel

- Debug panel displays selected user.
- Debug panel displays detected role.
- Debug panel displays detected intent.
- Debug panel displays extracted entities.
- Debug panel displays permission result.
- Debug panel displays data used.
- Debug panel displays escalation status.

### 20.5 Escalation

- Emergency question shows live agent CTA.
- Complaint question shows live agent CTA.
- Unknown issue shows live agent CTA.
- Direct live agent request shows live agent CTA.
- Clicking live agent CTA adds escalation confirmation to chat.

### 20.6 UI/UX

- UI is responsive.
- UI supports light mode.
- UI supports dark mode.
- Desktop layout has three clear sections.
- Mobile layout remains usable.
- Chat is easy to read.
- Buttons are accessible.
- No console errors.

---

## 21. Risks and Mitigations

### Risk 1: AI Gives Unauthorized Answer

**Mitigation:**

- Use application-level permission filtering before answer generation.
- Do not pass all mock data to the assistant.
- Add explicit permission checks.

### Risk 2: AI Hallucinates Missing Data

**Mitigation:**

- If data is not found, assistant must say it cannot find the data.
- Offer live agent handoff.

### Risk 3: Demo Scope Becomes Too Large

**Mitigation:**

- Limit demo to mock data.
- Focus only on identity, role, permission, question answering, and handoff.
- Do not build real AppFolio integration yet.

### Risk 4: Client Expects Real AppFolio Integration Immediately

**Mitigation:**

- Clearly explain that the demo validates the core business logic first.
- Real AppFolio integration is part of the next phase.

---

## 22. Future Phase Roadmap

### Phase 1: Demo

- Mock data.
- Role selector.
- Chat UI.
- Permission logic.
- Live agent mock.
- Demo deployment.

### Phase 2: Technical Discovery

- Confirm AppFolio API access.
- Map AppFolio entities to assistant data model.
- Confirm authentication approach.
- Confirm user identity mapping.
- Define production permission matrix.

### Phase 3: MVP Integration

- Connect to real AppFolio or data sync layer.
- Implement secure authentication.
- Implement real role-based data access.
- Implement production AI assistant.
- Add conversation history.
- Add admin monitoring.

### Phase 4: Communication Integration

- SMS integration.
- Email integration.
- Live chat provider integration.
- Notification workflow.
- Escalation workflow.

### Phase 5: Production Operations

- Monitoring.
- Audit logs.
- Data privacy checks.
- Admin dashboard.
- Maintainer support.
- Continuous improvement.

---

## 23. Recommended Build Plan

### Day 1: Core Functionality

- Build Next.js app.
- Create mock data.
- Create user selector.
- Create chat UI.
- Create intent detection.
- Create entity extraction.
- Create access control.
- Implement basic answers.
- Implement unauthorized refusal.

### Day 2: Demo Polish

- Add responsive design.
- Add light/dark mode.
- Add suggested questions.
- Add debug panel.
- Add live agent mock.
- Polish copywriting.
- Test all demo scenarios.
- Deploy to Vercel.
- Prepare demo script.

---

## 24. Open Questions

1. Does the client currently have AppFolio API access?
2. Who are the real production user types?
3. Should HOA/Board have access to owner names or only building operations?
4. Should building owners see tenant names or only summarized occupancy data?
5. Should live agent handoff go to SMS, email, or a live chat system?
6. Should the assistant support inbound SMS/email in later phases?
7. Should the assistant create new maintenance requests or only check existing ones in the first MVP?
8. What data privacy requirements apply to Australian property management context?

---

## 25. Final Demo Positioning

The first demo should be positioned as:

> This is a controlled demo using mock AppFolio-style data. The purpose is to validate the most important logic first: user identity, role-based access, safe answers, maintenance status checks, rent and lease support, and live agent handoff.
>
> Once Paul and Caleb validate this flow, the next step is real AppFolio integration discovery, production authentication, real data sync, and maintainer support.

---

## 26. One-Sentence Summary

Dian AI Assistant is a secure, role-aware property management AI Assistant that helps tenants, owners, HOA boards, and admins get fast answers from property data while protecting sensitive information and escalating unresolved cases to human support.
