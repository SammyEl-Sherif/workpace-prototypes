## Technical PRD — WorkPace Client Portal

### 1) Summary

- **One-liner:** A secure client portal that onboards qualified leads, collects
  business details, manages contract signing, and provides real-time visibility
  into project/workspace status.
- **Who it is for:** Qualified leads and active clients of WorkPace who need a
  single place to onboard, sign, track progress, and request changes.
- **Why now:** Current workflow is fragmented across email, docs, and internal
  Notion views. This increases cycle time, errors, and support load.

### 2) Problem statement

Today, leads and clients must coordinate across multiple tools and ad-hoc
communication to:

- Provide intake details.
- Review and sign contracts.
- Understand current project status.
- Request changes.

This causes:

- Slow onboarding and stage progression.
- Inconsistent data capture.
- Poor client visibility, which drives follow-up messages.

Desired future state:

- A single authenticated interface for client actions and self-serve visibility.

### 3) Goals and success metrics

**Primary goal**

- Enable end-to-end client onboarding and project progression through a single
  portal.

**Secondary goals**

- Reduce internal ops overhead for intake, status updates, and change requests.
- Provide a consistently “catered” experience using captured business context.

**Success metrics (initial)**

- Onboarding completion rate (account created → intake submitted).
- Median time from “qualified lead” → “contract executed”.
- Reduction in inbound status requests (baseline vs after launch).
- Time-to-triage for change requests.

### 4) Non-goals

- Full billing/invoicing and payment processing (unless explicitly added later).
- Replacing the internal WorkPace operating system (portal is a client-facing
  layer).
- Generic CRM for all leads (portal starts at “qualified lead”).

### 5) Users + user stories

**Personas**

- **Qualified lead:** evaluating WorkPace, needs quick onboarding and clear next
  steps.
- **Client stakeholder:** wants transparency on progress and a way to request
  changes.
- **Internal operator (WorkPace):** needs structured intake, contract status,
  and requests captured into Notion.

**User stories**

- As a qualified lead, I want to create an account so that I can access my
  onboarding checklist and next steps.
- As a qualified lead, I want to submit my business details through simple forms
  so that WorkPace can tailor the workspace setup.
- As a client, I want to review and sign contracts so that we can move to the
  next stage.
- As a client, I want to see project/workspace status so that I do not have to
  ask for updates.
- As a client, I want to request changes so that my workspace remains aligned
  with business needs.

### 6) Functional requirements

**Authentication + accounts**

1. **P0:** User can create an account (email-based) and log in.
2. **P0:** Each account is associated with a single organization (or an
   organization selector if multiple are supported later).
3. **P0:** Access control restricts users to only their organization’s data.

**Client intake (forms)**

1. **P0:** Portal supports a multi-step intake flow for business details (simple
   forms).
2. **P0:** Intake submissions are written to Notion as structured records (not
   freeform only).
3. **P1:** Intake can be resumed (draft save) and shows completion status.
4. **P1:** Intake answers can personalize the portal (e.g., recommended modules,
   tailored checklist).

**Contracts**

1. **P0:** Portal displays the current contract(s) to be signed.
2. **P0:** Client can sign/execute a contract (via an e-sign provider
   integration or an embedded signing flow).
3. **P0:** Contract execution state is synchronized back to Notion and gates
   stage transitions.
4. **P1:** Versioning: when a contract is revised, client sees what changed and
   must re-sign.

**Stage progression**

1. **P0:** Portal shows current stage and next required action(s) for the
   client.
2. **P0:** Completing gated actions (e.g., sign contract) advances stage status
   in Notion.

**Status + dashboards**

1. **P0:** Portal shows a read-only status dashboard for the client’s
   project/workspace.
2. **P0:** Dashboard data is sourced from Notion and rendered in a
   client-friendly UI.
3. **P1:** Dashboard supports “last updated” and highlights what changed since
   last visit.

**Change requests**

1. **P0:** Client can submit a change request with category, description,
   priority, and optional attachments.
2. **P0:** Change requests are written to Notion as structured records and
   linked to the correct project/org.
3. **P1:** Client can view request status and conversation history (if
   supported).

**Notifications (optional initial scope)**

1. **P1:** Email notifications for key events (contract ready, contract
   executed, request updated).

### 7) UX / interaction design

**Primary navigation**

- Home (overview + next actions)
- Intake
- Contracts
- Status
- Requests
- Account / org settings

**Key UI states**

- First login: onboarding checklist and guided intake.
- Contract pending: prominent call-to-action to review/sign.
- Status view: clean, non-Notion UI with key KPIs and progress.
- Request form: structured submission, confirmation, and visible status.

**Error states (minimum)**

- Unauthorized / expired session.
- Notion sync failure (show “we’re having trouble loading” with retry).
- Contract signing failure or partial completion.
- Duplicate submission (idempotency).

### 8) Data model (proposed)

**Entities**

- **Organization**
  - id, name, domain (optional), created_at
- **PortalUser**
  - id, email, name, org_id, role (admin/member)
- **IntakeSubmission**
  - id, org_id, status (draft/submitted), answers (structured JSON),
    submitted_at
- **Contract**
  - id, org_id, title, version, status (draft/sent/signed), signed_at,
    signing_provider_id
- **Stage** (or ProjectStage)
  - id, project_id, name, status, gated_by (contract_id / requirement)
- **DashboardSnapshot** (optional)
  - org_id, computed_metrics, last_computed_at
- **ChangeRequest**
  - id, org_id, project_id, category, description, priority, status, created_at

**Source of truth**

- Notion is source of truth for project/stage/request metadata.
- Contract signing provider is source of truth for signature artifacts.

**Validation rules (examples)**

- Email must be unique within portal.
- ChangeRequest must include category + description.
- Contract stage gating cannot be bypassed without signed_at.

**Example records**

- IntakeSubmission.answers example: {"company_name":"Acme
  DevCo","portfolio_size":12,"tools":["Notion","Gmail"],"goals":["centralize
  docs","project reporting"]}
- ChangeRequest example:
  {"category":"Dashboard","priority":"High","description":"Add 'Open invoices'
  widget and filter by month"}

### 9) Interfaces + integrations

**Notion**

- **Read:** org/project status, stage, dashboards, contract metadata, request
  statuses.
- **Write:** intake submissions, change requests, stage updates (as allowed).
- Constraints:
  - Respect Notion API rate limits.
  - Cache read models for portal performance.
  - Map portal org/project identifiers to Notion page URLs.

**E-sign provider (TBD)**

- **Write:** create/send envelope.
- **Read:** signature status + signed documents.
- Webhooks recommended for reliable status updates.

**Email (optional)**

- Send transactional notifications.

### 10) Business rules and edge cases

**Business rules**

- Stage progression is gated by completion of required artifacts (e.g., signed
  contract).
- Requests must always be linked to an org and (when applicable) a project.

**Edge cases**

- User belongs to multiple orgs (defer or implement org switcher).
- Notion page moved/archived causing broken mapping.
- Contract updated after partial signing (invalidate previous signing session).
- Duplicate change requests submitted quickly (use idempotency key).
- Portal shows stale status if Notion is unreachable (show cached + timestamp).

**Failure modes + recovery**

- Notion write fails: queue retry and show “received, processing” state.
- Webhook missed: periodic reconciliation job to sync signing status.

### 11) Security, privacy, and compliance

- Treat intake and contracts as sensitive data.
- Principle of least privilege for Notion integration token.
- Avoid logging PII or contract contents.
- Store signed documents securely with restricted access.

### 12) Observability

- Log correlation IDs per request.
- Metrics:
  - Portal login success rate
  - Notion API error rate / latency
  - Intake completion funnel
  - Contract signing funnel
  - Change request submission success rate
- Alerts:
  - Elevated Notion write failures
  - Webhook processing backlog

### 13) Acceptance criteria (minimum)

1. Given a qualified lead, when they create an account and log in, then they see
   an onboarding checklist and can start intake.
2. Given an in-progress intake, when the user saves, then the draft is persisted
   and can be resumed.
3. Given a contract in “sent” state, when the user signs, then the portal
   reflects “signed” and Notion is updated.
4. Given a signed contract, when the stage is gated by that contract, then the
   stage advances in Notion and the portal updates.
5. Given an active project, when the user opens Status, then they see a
   dashboard derived from Notion data and a last-updated timestamp.
6. Given a change request submission, when the user submits, then a Notion
   record is created and the portal shows the new request with status.

### 14) Test plan (outline)

- Auth tests: sign-up, login, session expiry.
- Notion integration tests: read models, write intake, write change request,
  stage update.
- Contract integration tests: webhook processing, reconciliation, resend/expire
  flows.
- E2E: onboarding flow (account → intake → contract → status → change request).

### 15) Open questions + assumptions

**Open questions**

- What qualifies a “qualified lead” and how are they invited (self-serve, invite
  link, internal approval)?
- What e-sign provider should be used (DocuSign, Dropbox Sign, etc.)?
- What exact status metrics should appear on the dashboard for clients?
- Should clients see comments/conversations on change requests, or just status?
- Will the portal be single-project per org initially, or multi-project?

**Assumptions**

- **Validate:** Notion contains (or will contain) the canonical project stage +
  status fields needed for client-facing reporting.
- **Validate:** A stable mapping exists between portal org/project and Notion
  pages.
- **Accept:** Initial release is web-only (no mobile app).

### 16) Out of scope / future ideas

- Payments and invoicing portal.
- In-portal chat support.
- Role-based permissioning beyond basic org member/admin.
