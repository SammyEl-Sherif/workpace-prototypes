import { interrupt } from '@langchain/langgraph'

import { PipelineState } from '../state'
import { updatePipelineStatus } from '../integrations/notion-pipeline'
import { sendClientSms, sendClientEmail, sendAdminSms } from '../integrations/pingram'
import { logAuditEvent } from '../utils/audit'

export async function meetingPrep(state: PipelineState): Promise<Partial<PipelineState>> {
  await sendClientSms(
    state.clientPhone,
    `Hi ${state.clientName}, looking forward to our meeting${
      state.meetingDatetime ? ` on ${state.meetingDatetime}` : ''
    }. Please let us know if you have any questions beforehand!`
  )

  await sendClientEmail(
    state.clientEmail,
    state.clientPhone,
    `Hi ${state.clientName}, this is a reminder about our upcoming meeting${
      state.meetingDatetime ? ` scheduled for ${state.meetingDatetime}` : ''
    }. We look forward to speaking with you!`
  )

  await updatePipelineStatus(state.notionPageId, 'Intro Meeting')

  await logAuditEvent(state.notionPageId, 'meetingPrep', 'reminder_sent', 'system', {
    clientEmail: state.clientEmail,
  })

  return {
    status: 'intro_meeting',
    lastActivity: new Date().toISOString(),
  }
}

export async function logMeeting(state: PipelineState): Promise<Partial<PipelineState>> {
  await sendAdminSms(
    `Meeting with ${state.clientName} — please log notes and decide: INTERESTED or NOT_INTERESTED.`
  )

  await logAuditEvent(state.notionPageId, 'logMeeting', 'awaiting_decision', 'system')

  const decision = interrupt(
    'Meeting review required. Provide interest decision, meeting notes, and pricing discussed.'
  ) as { action: string; meetingNotes?: string; pricingDiscussed?: number }

  await logAuditEvent(state.notionPageId, 'logMeeting', 'decision_received', 'admin', {
    action: decision.action,
  })

  return {
    adminDecision: decision.action,
    meetingNotes: decision.meetingNotes || null,
    pricingDiscussed: decision.pricingDiscussed ?? null,
    lastActivity: new Date().toISOString(),
  }
}
