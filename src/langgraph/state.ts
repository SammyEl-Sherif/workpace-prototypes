import { Annotation } from '@langchain/langgraph'

export const PipelineAnnotation = Annotation.Root({
  // ── Client Info ──
  clientName: Annotation<string>,
  clientEmail: Annotation<string>,
  clientPhone: Annotation<string>,
  source: Annotation<string>,

  // ── Pipeline Tracking ──
  status: Annotation<
    | 'new_lead'
    | 'intro_meeting'
    | 'interest_confirmed'
    | 'portal_invite_sent'
    | 'account_created'
    | 'intake_pending'
    | 'needs_assessment'
    | 'contract_draft'
    | 'awaiting_signature'
    | 'active_client'
    | 'lost'
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
})

export type PipelineState = typeof PipelineAnnotation.State
