import { interrupt } from '@langchain/langgraph'

import { PipelineState } from '../state'
import { updatePipelineStatus } from '../integrations/notion-pipeline'
import { sendClientSms, sendClientEmail, sendAdminSms } from '../integrations/notifications'
import { logAuditEvent } from '../utils/audit'
import { IntakeService } from '@/apis/controllers/portal/intake.service'
import { draftScopeOfWork } from '../integrations/openai'

const PORTAL_BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export async function sendIntakeNotification(
  state: PipelineState
): Promise<Partial<PipelineState>> {
  const intakeUrl = `${PORTAL_BASE_URL}/portal/intake`

  await sendClientSms(
    state.clientPhone,
    `Hi ${state.clientName}, your account is active! Please fill out the intake form to help us understand your needs: ${intakeUrl}`
  )

  await sendClientEmail(
    state.clientEmail,
    state.clientPhone,
    `Hi ${state.clientName}, your client portal account is now active. Please complete the intake form at ${intakeUrl} so we can begin planning your project.`
  )

  await updatePipelineStatus(state.notionPageId, 'Inbound Request Logged')

  await logAuditEvent(state.notionPageId, 'sendIntakeNotification', 'intake_notification_sent')

  return {
    status: 'intake_pending',
    lastActivity: new Date().toISOString(),
  }
}

export async function assessNeeds(state: PipelineState): Promise<Partial<PipelineState>> {
  await logAuditEvent(state.notionPageId, 'assessNeeds', 'awaiting_intake')

  const intakeDecision = interrupt('Waiting for client to submit intake form.') as {
    action: string
  }

  if (intakeDecision.action !== 'intake_submitted' || !state.orgId) {
    return { lastActivity: new Date().toISOString() }
  }

  // Fetch intake responses
  const submission = await IntakeService.getByOrgId(state.orgId)
  if (!submission) {
    return {
      error: 'Intake submission not found',
      lastActivity: new Date().toISOString(),
    }
  }

  const intakeData = {
    company_info: submission.company_info,
    tools_tech: submission.tools_tech,
    goals_needs: submission.goals_needs,
  }

  // Draft scope-of-work using OpenAI
  const scopeDraft = await draftScopeOfWork(intakeData)

  await sendAdminSms(
    `Intake received from ${state.clientName}. Scope-of-work draft ready for review.`
  )

  await logAuditEvent(state.notionPageId, 'assessNeeds', 'scope_drafted', 'system')

  // Wait for admin to approve the scope draft
  const scopeApproval = interrupt('Scope-of-work draft ready. Approve or provide revisions.') as {
    action: string
    revisedScope?: string
  }

  const finalScope = scopeApproval.revisedScope || scopeDraft

  await updatePipelineStatus(state.notionPageId, 'Qualified (Ready for Proposal)')

  await logAuditEvent(state.notionPageId, 'assessNeeds', 'scope_approved', 'admin')

  return {
    status: 'needs_assessment',
    intakeFormResponses: intakeData,
    scopeOfWorkDraft: finalScope,
    adminDecision: scopeApproval.action,
    lastActivity: new Date().toISOString(),
  }
}
