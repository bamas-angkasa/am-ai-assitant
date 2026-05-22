# Demo Script

## 1. Start The Demo

Open `http://localhost:3000` and select a role.

## 2. Tenant

Ask:

- How much rent do I owe?
- What is the status of my maintenance issue?
- Can you show another tenant's payment?

Expected: own data is answered, another tenant's data is blocked.

## 3. Unit Owner

Ask:

- How is my unit performing?
- Is my tenant paid up?
- Are there open maintenance issues for my unit?

Expected: owned unit data only.

## 4. HOA / Board Member

Ask:

- What are the top building issues this month?
- Are there overdue payments in the building?

Expected: building maintenance summaries are allowed; private payment details are blocked.

## 5. Building Owner

Ask:

- Show me portfolio performance.
- Which property has the most risk?

Expected: portfolio-level summary.

## 6. Property Manager / Admin

Open `http://localhost:3000/admin`.

Show:

- Open maintenance
- Overdue payments
- Escalations
- Audit logs

Explain that every assistant turn creates an audit log.
