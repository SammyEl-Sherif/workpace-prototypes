# Notion Workspace Consulting — Automated Client Pipeline & Contract Workflow

**Product Requirements Document + LangGraph.js Implementation Specification**
**Version 2.0 — February 2026**

---

# Part One: Product Requirements Document

## 1. Overview

This document defines the requirements for an automated client pipeline and contract workflow system for a Notion Workspace consulting business. The system replaces manual, error-prone handoffs between pipeline stages with a deterministic, event-driven workflow orchestrated by LangGraph.js, **integrated directly into the existing WorkPace Next.js monorepo and client portal**.

The core value proposition is eliminating dropped leads, forgotten follow-ups, and manual copy-paste between tools by encoding the entire client lifecycle as a state machine with human-in-the-loop checkpoints at every business-critical decision point.

### 1.1 Problem Statement

Consulting businesses that rely on manual pipeline management face predictable failure modes: leads go cold because follow-up emails are forgotten, client portal invitations are sent to the wrong address, contracts sit in draft limbo because no one owns the "send for signature" step, and project kickoff is delayed because the signed contract notification gets buried in an inbox.

Each of these failures is individually minor but compounds into revenue leakage and a poor client experience. The system described here eliminates these gaps by making every transition between pipeline stages explicit, auditable, and automated where possible.

### 1.2 Existing Client Portal (What's Already Built)

The WorkPace client portal (`/portal/*`) already provides:

- **User signup & approval** — Self-serve signup with org creation, admin approval workflow (`pending_approval → active`)
- **Intake forms** — Multi-step intake (Company Info → Tools & Tech → Goals & Needs → Review) with draft persistence and submission tracking
- **Contracts** — DocuSign integration with OAuth, envelope creation, signing URLs, status tracking (`draft → sent → signed`), version management
- **Change requests** — Submit/track change requests with category, priority, and status progression
- **Portal dashboard** — Onboarding checklist, progress visualization, recent activity

**LangGraph's role is to orchestrate these existing systems**, not replace them. It provides the state machine that ensures no step is missed, automates notifications, enforces timeouts, and adds human-in-the-loop gates where needed.

### 1.3 Goals & Non-Goals

| Goals                                                          | Non-Goals                                                    |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| Deterministic pipeline transitions with zero dropped leads     | Replacing Notion as the CRM (Notion remains source of truth) |
| Human-in-the-loop approval at every business-critical gate     | AI-driven pricing or proposal generation (v2+)               |
| SMS/email notifications at each stage                          | Multi-tenant / white-label support                           |
| Full audit trail in Supabase + Notion databases                | Replacing DocuSign with a custom e-signature solution        |
| Orchestrate existing portal signup, intake, and contract flows | Rebuilding existing portal features                          |
| DocuSign contract generation and tracking                      | Replacing existing portal controllers/services               |
| Automated project creation on contract execution               |                                                              |

---

## 2. User Personas

### 2.1 Business Admin (You)

The consulting business owner who manages the pipeline, reviews intake forms, drafts and approves contracts, and makes all go/no-go decisions. This persona is the human-in-the-loop at every approval gate. They interact with the system through the existing admin dashboard (`/apps/*`), Notion dashboards, SMS notifications, and email.

### 2.2 Client / Prospective Client

The person or organization seeking Notion workspace consulting. They experience the system through SMS and email communications, the **existing client portal** (`/portal/*`) for onboarding, the built-in intake forms, and DocuSign for contract execution. They should never feel like they are interacting with a bot; every touchpoint should feel personal and professional.

### 2.3 System (LangGraph Agent)

The automated orchestrator. It does not make business decisions. It executes transitions, sends notifications, generates document drafts, and waits for human approval before proceeding at every gate. It calls existing portal services and controllers — it is a coordination layer, not a replacement for the existing application logic.

---

## 3. Pipeline Stages & Transitions

The following table defines each stage in the client lifecycle, the trigger that moves the lead into that stage, the action the system takes, and who owns the decision.

| #   | Stage                  | Trigger                                                           | System Action                                                                                                                                                                                                                                          | Owner                              |
| --- | ---------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| 1   | **New Lead**           | Meeting scheduled (Calendly webhook or manual entry)              | Create lead record in Notion Pipeline DB. Populate name, email, phone, source, meeting datetime. Set status to "New Lead." Send admin SMS confirmation.                                                                                                | System (auto)                      |
| 2   | **Intro Meeting**      | Meeting datetime reached                                          | Send client a pre-meeting reminder (SMS + email). After meeting, prompt admin to log meeting notes and pricing discussion outcome in Notion.                                                                                                           | Admin + System                     |
| 3a  | **Interest Confirmed** | Admin marks lead as "Interested"                                  | Generate unique client portal sign-up link (`/portal/signup?ref={thread_id}`). Send link to client via SMS + email. Set status to "Portal Invite Sent." Start 48-hour follow-up timer.                                                                 | Admin (decision) → System (action) |
| 3b  | **Lost**               | Admin marks lead as "Not Interested"                              | Set status to "Lost." Log reason if provided. Send admin summary. Optionally schedule a re-engagement check-in for 90 days.                                                                                                                            | Admin (decision) → System (action) |
| 4   | **Account Created**    | Client completes portal sign-up (existing `/api/portal/signup`)   | Notify admin of new account. Admin reviews and approves via existing approval flow (`/api/portal/admin/[id]/approve`). On approval: set portal user to `active`, notify client that intake form is available. Set pipeline status to "Intake Pending." | Admin (approval) → System (action) |
| 5   | **Needs Assessment**   | Client submits intake form (existing `/api/portal/intake/submit`) | Parse intake form responses from `intake_submissions` table. Summarize client needs and budget for admin review. Use LLM to draft a scope-of-work outline. Present to admin for refinement. Generate DocuSign contract draft from approved scope.      | System (draft) → Admin (review)    |
| 6   | **Contract Review**    | Contract draft generated                                          | Present draft to admin. Admin edits/approves. On approval: send contract to client via DocuSign using existing contract service (`contracts.service.ts`). Set status to "Awaiting Signature." Notify client via SMS.                                   | Admin (approval) → System (send)   |
| 7   | **Contract Signed**    | DocuSign completion webhook                                       | Notify admin via SMS + email. Create new Project in Notion Projects DB with linked client, scope, and contract. Set pipeline status to "Active Client." Send client a welcome message with next steps.                                                 | System (auto)                      |

---

## 4. Notification Matrix

Every stage transition triggers at least one notification. The matrix below defines who gets notified, through which channel, and the urgency level.

| Event                            | Admin SMS | Admin Email | Client SMS | Client Email      |
| -------------------------------- | --------- | ----------- | ---------- | ----------------- |
| New lead created                 | ✅        | ✅          | —          | —                 |
| Meeting reminder                 | ✅        | —           | ✅         | ✅                |
| Portal invite sent               | ✅        | —           | ✅         | ✅                |
| Portal sign-up completed         | ✅        | ✅          | —          | ✅ (confirmation) |
| Intake form submitted            | ✅        | ✅          | —          | ✅ (confirmation) |
| Contract sent for signing        | ✅        | —           | ✅         | ✅ (DocuSign)     |
| Contract signed                  | ✅        | ✅          | ✅         | ✅ (welcome)      |
| Follow-up reminder (no response) | ✅        | —           | ✅         | ✅                |

---

## 5. External Integrations

| Service             | Purpose                                                 | Integration Method                     | Status                                               |
| ------------------- | ------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Notion API          | Pipeline DB, Projects DB, client records                | REST API (`@notionhq/client`)          | **Existing** — already in `package.json`             |
| Pingram             | SMS + email notifications (admin + client)              | SDK (`pingram`)                        | **Existing** — already in `package.json`             |
| DocuSign            | Contract generation, sending, signature tracking        | eSignature REST API + Connect webhooks | **Existing** — OAuth + envelope flow built in portal |
| Calendly (optional) | Meeting scheduling + new lead trigger                   | Webhook subscription                   | **New** — webhook endpoint only                      |
| OpenAI              | LLM for scope-of-work drafting and intake summarization | REST API (`openai` SDK)                | **Existing** — already in `package.json`             |

---

## 6. Follow-Up & Timeout Logic

Stale leads are revenue leaks. The system enforces follow-up timers at stages where the client must take action. If no response is received within the timeout window, the system sends a reminder. After a configurable number of reminders, it escalates to the admin for a manual decision.

| Waiting On             | Timeout         | Max Reminders | Escalation                                                       |
| ---------------------- | --------------- | ------------- | ---------------------------------------------------------------- |
| Portal sign-up         | 48 hours        | 2             | Notify admin; suggest marking as Lost or calling client directly |
| Intake form submission | 72 hours        | 2             | Notify admin; option to resend or schedule a call                |
| Contract signing       | 5 business days | 3             | Notify admin; flag as "At Risk" in pipeline                      |

---

## 7. Data Model

### 7.1 Existing Supabase Tables (No Changes Needed)

These tables are already defined in `supabase/schemas/` and fully operational:

| Table                | Schema File              | Purpose                                                                                           |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| `organizations`      | `organizations.sql`      | One org per client account                                                                        |
| `portal_users`       | `portal_users.sql`       | User accounts with role (`admin`/`member`) and status (`pending_approval`/`active`/`deactivated`) |
| `intake_submissions` | `intake_submissions.sql` | Multi-step intake form data (company_info, tools_tech, goals_needs as JSONB)                      |
| `contracts`          | `contracts.sql`          | DocuSign contract tracking (envelope_id, status, signing method, versions)                        |
| `change_requests`    | `change_requests.sql`    | Client change requests with category, priority, status progression                                |

### 7.2 New Table: `pipeline_threads` (LangGraph Orchestration)

A lightweight lookup table that maps external identifiers to LangGraph thread IDs. This enables webhook handlers to find and resume the correct graph execution.

```sql
-- supabase/schemas/pipeline_threads.sql
CREATE TABLE IF NOT EXISTS public.pipeline_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id TEXT NOT NULL UNIQUE,
  client_email TEXT,
  client_phone TEXT,
  org_id UUID REFERENCES public.organizations(id),
  envelope_id TEXT,
  notion_page_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pipeline_threads_email ON public.pipeline_threads(client_email);
CREATE INDEX idx_pipeline_threads_org ON public.pipeline_threads(org_id);
CREATE INDEX idx_pipeline_threads_envelope ON public.pipeline_threads(envelope_id);
```

### 7.3 New Table: `pipeline_audit_log`

Every state transition, notification, and approval is logged for traceability.

```sql
-- supabase/schemas/pipeline_audit_log.sql
CREATE TABLE IF NOT EXISTS public.pipeline_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id TEXT NOT NULL,
  node_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'system',
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_thread ON public.pipeline_audit_log(thread_id);
CREATE INDEX idx_audit_log_created ON public.pipeline_audit_log(created_at);
```

### 7.4 Notion Databases (External)

#### Pipeline Database

| Property             | Type      | Notes                                                                                                                                          |
| -------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Client Name          | Title     | Full name of the lead/client                                                                                                                   |
| Email                | Email     | Primary contact email                                                                                                                          |
| Phone                | Phone     | Primary contact phone (used for SMS)                                                                                                           |
| Status               | Select    | New Lead · Intro Meeting · Portal Invite Sent · Intake Pending · Needs Assessment · Contract Draft · Awaiting Signature · Active Client · Lost |
| Source               | Select    | Calendly · Referral · Website · Cold Outreach · Other                                                                                          |
| Meeting Date         | Date      | Scheduled intro meeting datetime                                                                                                               |
| Meeting Notes        | Rich Text | Admin-entered notes from intro meeting                                                                                                         |
| Pricing Discussed    | Number    | Quoted price range or estimate                                                                                                                 |
| Portal Link          | URL       | Unique client portal sign-up URL                                                                                                               |
| Intake Form ID       | Rich Text | Reference to submitted intake form                                                                                                             |
| Contract Envelope ID | Rich Text | DocuSign envelope ID for tracking                                                                                                              |
| Project              | Relation  | Linked Project record (populated on contract signing)                                                                                          |
| Last Activity        | Date      | Auto-updated on any status change                                                                                                              |
| Reminder Count       | Number    | Tracks follow-up reminders sent at current stage                                                                                               |
| LangGraph Thread ID  | Rich Text | Thread ID for workflow traceability                                                                                                            |

#### Projects Database

| Property      | Type      | Notes                                          |
| ------------- | --------- | ---------------------------------------------- |
| Project Name  | Title     | Client name + engagement type                  |
| Client        | Relation  | Link back to Pipeline DB record                |
| Scope of Work | Rich Text | Approved scope from intake/contract            |
| Contract URL  | URL       | Link to signed DocuSign document               |
| Start Date    | Date      | Target engagement start date                   |
| Status        | Select    | Not Started · In Progress · On Hold · Complete |
| Budget        | Number    | Contracted amount                              |

---

## 8. Security & Compliance Considerations

- All API keys and tokens stored in environment variables (`.env.local`), never in code or Notion.
- Client PII (email, phone) encrypted at rest via Supabase's built-in encryption.
- DocuSign OAuth tokens refreshed automatically; refresh token stored securely (existing implementation).
- Webhook endpoints validated using provider-specific signature verification (DocuSign HMAC, Calendly webhook signing key).
- LangGraph checkpointer uses Supabase PostgreSQL with encryption at rest.
- Admin approval actions authenticated via existing `withApiAuth` middleware.
- Audit log: every state transition, notification sent, and approval action is logged in `pipeline_audit_log` with timestamp, actor, and outcome.
- LangGraph API routes protected by the same auth middleware as all other portal API routes.

---

---

# Part Two: LangGraph.js Implementation Details

## 1. Architecture Overview

The system is built as a LangGraph.js `StateGraph` that models the client pipeline as a finite state machine, **running inside the existing Next.js application**. Each pipeline stage is a node. Edges are either deterministic (webhook-triggered) or conditional (based on admin input). Human-in-the-loop is implemented using LangGraph's `interrupt()` primitive, which pauses graph execution and persists state until the admin provides input via a `Command`.

### 1.1 Why LangGraph Over Alternatives

LangGraph is the right tool here because this workflow is fundamentally a state machine with long-running pauses (waiting for client actions, admin approvals). LangGraph's built-in checkpointing means the workflow survives server restarts and can pause for days while waiting for a DocuSign signature. The `interrupt`/`Command` pattern maps naturally to human-in-the-loop approval gates. And the graph structure makes the workflow auditable and testable — you can visualize every possible path and write unit tests for each node independently.

### 1.2 Integration Strategy

LangGraph.js runs **inside the Next.js API routes**, not as a separate service. This means:

- No separate Python server or Docker container to manage
- Graph nodes call existing portal services directly (same process)
- Checkpointer uses the same Supabase PostgreSQL instance
- Webhook handlers are standard Next.js API routes with `withApiAuth`
- The graph is compiled once at module scope and reused across requests

---

## 2. State Schema (TypeScript)

The graph state carries all information needed to execute the workflow. State is persisted by the checkpointer after every node execution.

```typescript
// src/langgraph/state.ts
import { Annotation } from "@langchain/langgraph";

export const PipelineAnnotation = Annotation.Root({
  // ── Client Info ──
  clientName: Annotation<string>,
  clientEmail: Annotation<string>,
  clientPhone: Annotation<string>,
  source: Annotation<string>,

  // ── Pipeline Tracking ──
  status: Annotation<
    | "new_lead"
    | "intro_meeting"
    | "interest_confirmed"
    | "portal_invite_sent"
    | "account_created"
    | "intake_pending"
    | "needs_assessment"
    | "contract_draft"
    | "awaiting_signature"
    | "active_client"
    | "lost"
  >,
  notionPageId: Annotation<string>,
  meetingDatetime: Annotation<string | null>,
  meetingNotes: Annotation<string | null>,
  pricingDiscussed: Annotation<number | null>,

  // ── Portal & Intake ──
  portalLink: Annotation<string | null>,
  portalSignupComplete: Annotation<boolean>,
  orgId: Annotation<string | null>,
  intakeFormResponses: Annotation<Record<string, unknown> | null>,

  // ── Contract ──
  scopeOfWorkDraft: Annotation<string | null>,
  contractId: Annotation<string | null>,
  contractEnvelopeId: Annotation<string | null>,
  contractSigned: Annotation<boolean>,
  contractSignedUrl: Annotation<string | null>,

  // ── Project ──
  projectPageId: Annotation<string | null>,

  // ── Orchestration ──
  reminderCount: Annotation<number>,
  lastActivity: Annotation<string>,
  adminDecision: Annotation<string | null>,
  error: Annotation<string | null>,
});

export type PipelineState = typeof PipelineAnnotation.State;
```

---

## 3. Graph Structure

### 3.1 Node Inventory

Each node calls existing portal services where possible, keeping the graph thin.

| Node                     | Responsibility                                 | Interrupt? | LLM?    | Existing Service Used                             |
| ------------------------ | ---------------------------------------------- | ---------- | ------- | ------------------------------------------------- |
| `createLead`             | Create Notion Pipeline record, send admin SMS  | No         | No      | Notion client (existing)                          |
| `meetingPrep`            | Send client pre-meeting reminder               | No         | No      | Pingram (existing)                                |
| `logMeeting`             | Prompt admin for notes + interest decision     | **Yes**    | No      | —                                                 |
| `sendPortalInvite`       | Generate portal sign-up link, send to client   | No         | No      | Pingram (existing)                                |
| `markLost`               | Update Notion status to Lost, log reason       | No         | No      | Notion client (existing)                          |
| `approveAccount`         | Wait for signup + admin approval               | **Yes**    | No      | `portal.service.ts` (existing)                    |
| `sendIntakeNotification` | Notify client that intake form is available    | No         | No      | Pingram (existing)                                |
| `assessNeeds`            | Parse intake, draft scope-of-work with LLM     | **Yes**    | **Yes** | `intake.service.ts` (existing), OpenAI (existing) |
| `generateContract`       | Create DocuSign envelope from approved scope   | No         | No      | `contracts.service.ts` (existing)                 |
| `reviewContract`         | Present draft to admin, wait for approval      | **Yes**    | No      | —                                                 |
| `sendContract`           | Send DocuSign envelope, notify via SMS         | No         | No      | `contracts.service.ts` (existing)                 |
| `handleSigned`           | Create Project in Notion, send welcome message | No         | No      | Notion client (existing)                          |
| `sendReminder`           | Send follow-up SMS/email, increment counter    | No         | No      | Pingram (existing)                                |

### 3.2 Graph Definition

```typescript
// src/langgraph/graph.ts
import { StateGraph, START, END } from "@langchain/langgraph";
import { interrupt, Command } from "@langchain/langgraph";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { PipelineAnnotation } from "./state";
import {
  createLead,
  meetingPrep,
  logMeeting,
  sendPortalInvite,
  markLost,
  approveAccount,
  sendIntakeNotification,
  assessNeeds,
  generateContract,
  reviewContract,
  sendContract,
  handleSigned,
  sendReminder,
} from "./nodes";
import { routeAfterMeeting, routeAfterReview } from "./routing";

const builder = new StateGraph(PipelineAnnotation);

// ── Add Nodes ──
builder.addNode("createLead", createLead);
builder.addNode("meetingPrep", meetingPrep);
builder.addNode("logMeeting", logMeeting);
builder.addNode("sendPortalInvite", sendPortalInvite);
builder.addNode("markLost", markLost);
builder.addNode("approveAccount", approveAccount);
builder.addNode("sendIntakeNotification", sendIntakeNotification);
builder.addNode("assessNeeds", assessNeeds);
builder.addNode("generateContract", generateContract);
builder.addNode("reviewContract", reviewContract);
builder.addNode("sendContract", sendContract);
builder.addNode("handleSigned", handleSigned);
builder.addNode("sendReminder", sendReminder);

// ── Edges ──
builder.addEdge(START, "createLead");
builder.addEdge("createLead", "meetingPrep");
builder.addEdge("meetingPrep", "logMeeting");

// Conditional: admin decides interest after meeting
builder.addConditionalEdges("logMeeting", routeAfterMeeting, {
  interested: "sendPortalInvite",
  not_interested: "markLost",
});

builder.addEdge("markLost", END);
builder.addEdge("sendPortalInvite", "approveAccount");
// approveAccount interrupts — waits for portal signup + admin approval
builder.addEdge("approveAccount", "sendIntakeNotification");
builder.addEdge("sendIntakeNotification", "assessNeeds");
// assessNeeds interrupts — waits for intake submission, then uses LLM
builder.addEdge("assessNeeds", "generateContract");
builder.addEdge("generateContract", "reviewContract");

// Conditional: admin approves or requests revisions
builder.addConditionalEdges("reviewContract", routeAfterReview, {
  approved: "sendContract",
  revise: "assessNeeds",
});

builder.addEdge("sendContract", "handleSigned");
// handleSigned interrupts — waits for DocuSign webhook
builder.addEdge("handleSigned", END);

// ── Compile with Supabase PostgreSQL checkpointer ──
export async function createGraph() {
  const checkpointer = PostgresSaver.fromConnString(
    process.env.SUPABASE_DB_URL!
  );
  await checkpointer.setup();
  return builder.compile({ checkpointer });
}
```

---

## 4. Human-in-the-Loop Pattern

Every approval gate uses LangGraph's `interrupt()` primitive. When a node calls `interrupt()`, graph execution pauses and state is persisted to the checkpointer. The admin is notified (via SMS) that action is required. When the admin responds, the API route resumes the graph by invoking it with a `Command` object containing the admin's decision.

### 4.1 Example: Contract Approval Node

```typescript
// src/langgraph/nodes/contract.ts
import { interrupt } from "@langchain/langgraph";
import { PipelineState } from "../state";
import { sendAdminSms } from "../integrations/pingram";
import { logAuditEvent } from "../utils/audit";

export async function reviewContract(state: PipelineState) {
  await sendAdminSms(
    `Contract draft ready for ${state.clientName}. Review and reply APPROVE or REVISE.`
  );

  await logAuditEvent(state, "reviewContract", "awaiting_approval");

  // Pause execution until admin responds
  const decision = interrupt(
    "Contract review required. Reply with approve or revise."
  );

  return {
    adminDecision: decision.action,
    status:
      decision.action === "approved" ? "awaiting_signature" : "contract_draft",
    lastActivity: new Date().toISOString(),
  } satisfies Partial<PipelineState>;
}
```

### 4.2 Resuming with a Command

```typescript
// src/pages/api/pipeline/approve/[threadId].ts
import { Command } from "@langchain/langgraph";
import { createGraph } from "@/langgraph/graph";
import { withApiAuth } from "@/server/utils/withApiAuth";

export default withApiAuth(async (req, res) => {
  const { threadId } = req.query;
  const { action } = req.body; // 'approved' | 'revise' | 'interested' | etc.

  const graph = await createGraph();

  await graph.invoke(new Command({ resume: { action } }), {
    configurable: { thread_id: threadId as string },
  });

  res.status(200).json({ success: true });
});
```

---

## 5. Webhook & Event Handling

External events arrive as webhooks to Next.js API routes. Each handler looks up the correct LangGraph thread via the `pipeline_threads` table and resumes execution.

| Webhook Source   | API Route                                       | Graph Action                       | Thread Lookup      |
| ---------------- | ----------------------------------------------- | ---------------------------------- | ------------------ |
| Calendly         | `POST /api/pipeline/webhooks/calendly`          | Start new graph run (`createLead`) | New thread created |
| Portal Signup    | Internal (called from `portalSignupController`) | Resume at `approveAccount`         | By `client_email`  |
| Intake Submit    | Internal (called from `submitIntakeController`) | Resume at `assessNeeds`            | By `org_id`        |
| DocuSign Connect | `POST /api/pipeline/webhooks/docusign`          | Resume at `handleSigned`           | By `envelope_id`   |

### 5.1 Internal Event Hooks

For events that originate from existing portal API routes (signup, intake submit), the graph is resumed **from within the existing controller** rather than via a separate webhook. This avoids unnecessary HTTP round-trips:

```typescript
// Inside existing portalSignupController, after creating the user:
import { resumeThread } from "@/langgraph/utils/thread-lookup";

// After successful signup...
await resumeThread(
  { clientEmail: user.email },
  { action: "account_created", orgId }
);
```

### 5.2 Thread Lookup

```typescript
// src/langgraph/utils/thread-lookup.ts
import { query } from "@/db";

export async function findThread(criteria: {
  clientEmail?: string;
  orgId?: string;
  envelopeId?: string;
}) {
  const rows = await query<{ thread_id: string }>(
    "pipeline_threads/find_by_criteria.sql",
    [criteria.clientEmail, criteria.orgId, criteria.envelopeId]
  );
  return rows[0]?.thread_id ?? null;
}
```

---

## 6. Infrastructure & Deployment

### 6.1 Stack (Integrated into Existing Monorepo)

| Component         | Technology                                        | Notes                                            |
| ----------------- | ------------------------------------------------- | ------------------------------------------------ |
| API Server        | **Next.js API Routes** (existing)                 | New routes under `pages/api/pipeline/`           |
| Graph Runtime     | **LangGraph.js** (`@langchain/langgraph`)         | StateGraph compiled with PostgresSaver           |
| State Persistence | **Supabase PostgreSQL** (existing)                | Same DB instance, new tables for threads + audit |
| Notifications     | **Pingram** (existing)                            | SMS and email from graph nodes                   |
| LLM               | **OpenAI** (existing)                             | Scope-of-work drafting in `assessNeeds` node     |
| Hosting           | **Vercel** (existing, assumed)                    | Serverless-compatible with external checkpointer |
| Secrets           | **Environment variables** (existing `.env.local`) | New keys for Calendly                            |

### 6.2 New Dependencies

```bash
npm install @langchain/langgraph @langchain/langgraph-checkpoint-postgres @langchain/core
```

### 6.3 Project Structure (Within Existing Monorepo)

```
src/
├── langgraph/                      # NEW — LangGraph pipeline orchestration
│   ├── graph.ts                    # StateGraph definition + compilation
│   ├── state.ts                    # PipelineAnnotation (state schema)
│   ├── routing.ts                  # Conditional edge functions
│   ├── nodes/
│   │   ├── index.ts                # Barrel export
│   │   ├── lead.ts                 # createLead, markLost
│   │   ├── meeting.ts              # meetingPrep, logMeeting
│   │   ├── portal.ts              # sendPortalInvite, approveAccount
│   │   ├── intake.ts               # sendIntakeNotification, assessNeeds
│   │   ├── contract.ts             # generateContract, reviewContract, sendContract
│   │   └── project.ts              # handleSigned
│   ├── integrations/
│   │   ├── pingram.ts              # SMS + email helpers via Pingram
│   │   └── notion-pipeline.ts      # Notion Pipeline DB read/write
│   └── utils/
│       ├── thread-lookup.ts        # pipeline_threads table queries
│       ├── audit.ts                # pipeline_audit_log writes
│       └── reminders.ts            # Timeout + reminder logic
├── pages/api/pipeline/             # NEW — Pipeline API routes
│   ├── start.ts                    # POST: manually start a new pipeline run
│   ├── approve/[threadId].ts       # POST: admin approval/decision
│   ├── status/[threadId].ts        # GET: pipeline status for a thread
│   ├── threads.ts                  # GET: list active pipeline threads
│   └── webhooks/
│       ├── calendly.ts             # POST: Calendly webhook handler
│       └── docusign.ts             # POST: DocuSign Connect webhook handler
├── db/sql/pipeline_threads/        # NEW — SQL queries
│   ├── create.sql
│   ├── find_by_criteria.sql
│   ├── update.sql
│   └── get_active.sql
├── db/sql/pipeline_audit_log/      # NEW — SQL queries
│   ├── create.sql
│   └── get_by_thread.sql
├── pages/api/portal/               # EXISTING — touched for event hooks
│   ├── signup.ts                   # ADD: resume thread on signup
│   └── intake/submit.ts            # ADD: resume thread on intake submit
└── apis/controllers/portal/        # EXISTING — touched for event hooks
    ├── portal.controller.ts        # ADD: call resumeThread after signup
    └── intake.controller.ts        # ADD: call resumeThread after submit
```

### 6.4 Supabase Config Update

Add new schema files to `supabase/config.toml`:

```toml
schema_paths = [
  # ... existing schemas ...
  "schemas/pipeline_threads.sql",
  "schemas/pipeline_audit_log.sql",
]
```

---

## 7. Testing Strategy

Each node is a function that takes state and returns a state update, making them independently testable.

### 7.1 Test Levels

| Level       | What It Tests                                                                | Approach                                                                          |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Unit        | Individual node logic (e.g., does `createLead` write to Notion correctly?)   | Mock external APIs. Pass in a PipelineState object, assert returned state update. |
| Integration | Full graph traversal for a single path (e.g., happy path to contract signed) | Use `MemorySaver` checkpointer. Simulate `Command` resumes. Assert final state.   |
| Branching   | Conditional edges (e.g., interested vs. lost, approve vs. revise)            | Run graph with different admin decisions, verify correct node is reached.         |
| Timeout     | Reminder logic fires correctly after timeout                                 | Mock Date, advance clock, verify reminder node is triggered.                      |
| E2E         | Full system with real APIs (staging/sandbox)                                 | Use DocuSign sandbox, Pingram test credentials, Notion test workspace.            |

### 7.2 Test File Structure

```
src/
├── langgraph/
│   ├── __tests__/
│   │   ├── nodes/
│   │   │   ├── lead.test.ts
│   │   │   ├── meeting.test.ts
│   │   │   ├── portal.test.ts
│   │   │   ├── intake.test.ts
│   │   │   ├── contract.test.ts
│   │   │   └── project.test.ts
│   │   ├── graph.test.ts           # Integration: full graph traversal
│   │   ├── routing.test.ts         # Conditional edge tests
│   │   └── thread-lookup.test.ts   # Thread resolution tests
```

---

## 8. Phased Rollout Plan

Build incrementally. Each phase is independently deployable and useful.

### Phase 1: Foundation + Lead Capture (Week 1–2)

- **Setup:** Install LangGraph.js dependencies, create `src/langgraph/` directory structure, create Supabase schema files for `pipeline_threads` and `pipeline_audit_log`, run `npm run supabase:diff:local` to generate migrations.
- **Nodes:** `createLead`, `meetingPrep`, `logMeeting`, `markLost`
- **Integrations:** Notion Pipeline DB, Pingram SMS, Calendly webhook endpoint
- **API Routes:** `POST /api/pipeline/start`, `POST /api/pipeline/approve/[threadId]`, `POST /api/pipeline/webhooks/calendly`
- **Outcome:** New leads automatically appear in Notion. Admin gets SMS. Interest decision routes to portal invite or lost.

### Phase 2: Portal & Intake Integration (Week 3–4)

- **Nodes:** `sendPortalInvite`, `approveAccount`, `sendIntakeNotification`, `assessNeeds`
- **Integrations:** Hook into existing `portalSignupController` and `submitIntakeController`, Pingram email, OpenAI for scope drafting
- **Existing Code Touched:** Add `resumeThread` calls to `portal.controller.ts` and `intake.controller.ts`
- **Outcome:** Full onboarding flow from portal invite through needs assessment. LLM drafts scope-of-work for admin review.

### Phase 3: Contract & Project (Week 5–6)

- **Nodes:** `generateContract`, `reviewContract`, `sendContract`, `handleSigned`
- **Integrations:** Existing `contracts.service.ts` for DocuSign, DocuSign Connect webhook endpoint
- **API Routes:** `POST /api/pipeline/webhooks/docusign`
- **Outcome:** End-to-end pipeline from lead to active project. Contract generated, reviewed, signed, and project auto-created in Notion.

### Phase 4: Hardening & Observability (Week 7–8)

- **Features:** Follow-up timers via `sendReminder` node, reminder escalation logic, audit dashboard page, error recovery patterns
- **API Routes:** `GET /api/pipeline/status/[threadId]`, `GET /api/pipeline/threads`
- **Admin UI:** Pipeline overview page in `/apps/` showing active threads, pending approvals, and audit trail
- **Outcome:** Production-ready system with timeout handling, observability, and graceful error recovery.

---

## 9. Resolved Decisions

These were open questions in v1.0 — now resolved based on the existing codebase:

| #   | Question                     | Decision                                                                                                                  |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | Client portal implementation | **Custom Next.js** — already built at `/portal/*` with signup, intake, contracts, change requests                         |
| 2   | Intake form tool             | **Custom multi-step form** — already built in portal with Company Info, Tools & Tech, Goals & Needs steps                 |
| 3   | DocuSign integration         | **Already integrated** — OAuth flow, envelope creation, signing URLs, status webhooks all built in `contracts.service.ts` |
| 4   | SMS provider                 | **Pingram** — existing dependency, two-way SMS deferred to v2                                                             |
| 5   | LLM for scope drafting       | **OpenAI** (already in `package.json`) — Claude Sonnet 4.5 via Anthropic SDK is an option if needed                       |
| 6   | Admin dashboard              | **Hybrid** — Notion for CRM views, custom admin UI in `/apps/` for pipeline thread management and approvals               |
| 7   | Re-engagement for lost leads | **Deferred to Phase 4** — optional 90-day re-engagement email via `sendReminder` node                                     |

### 9.1 Remaining Open Questions

| #   | Question                         | Context                                                                                                                                                              |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Vercel serverless timeout limits | LangGraph graph invocations may exceed Vercel's 10s hobby / 60s pro timeout. May need Vercel Functions with `maxDuration` or a dedicated server for graph execution. |
| 2   | Checkpointer connection pooling  | `PostgresSaver` needs a persistent connection. Verify compatibility with Supabase connection pooling (transaction mode on port 6543 vs. session mode on port 5432).  |
| 3   | Cron-based reminder triggers     | How to trigger timeout checks — Vercel Cron, external cron service, or a lightweight scheduler within the app?                                                       |
| 4   | Pingram email channel            | Enable email sending in Pingram dashboard for pipeline notifications.                                                                                                |
