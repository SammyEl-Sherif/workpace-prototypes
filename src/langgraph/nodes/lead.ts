import { PipelineState } from '../state'
import { createPipelineRecord, updatePipelineStatus } from '../integrations/notion-pipeline'
import { sendAdminSms } from '../integrations/notifications'
import { logAuditEvent } from '../utils/audit'
import { createThread, updateThread } from '../utils/thread-lookup'

export async function createLead(state: PipelineState): Promise<Partial<PipelineState>> {
  const threadId = await createThread({
    clientEmail: state.clientEmail,
    clientPhone: state.clientPhone,
  })

  const notionPageId = await createPipelineRecord({
    clientName: state.clientName,
    clientEmail: state.clientEmail,
    clientPhone: state.clientPhone,
    source: state.source,
    meetingDatetime: state.meetingDatetime,
    threadId,
  })

  await updateThread(threadId, { notionPageId })

  await sendAdminSms(
    `New lead: ${state.clientName} (${state.source}). Meeting: ${state.meetingDatetime || 'TBD'}.`
  )

  await logAuditEvent(threadId, 'createLead', 'lead_created', 'system', {
    clientName: state.clientName,
    source: state.source,
  })

  return {
    status: 'new_lead',
    notionPageId,
    lastActivity: new Date().toISOString(),
    reminderCount: 0,
  }
}

export async function markLost(state: PipelineState): Promise<Partial<PipelineState>> {
  await updatePipelineStatus(state.notionPageId, 'Lost')

  await logAuditEvent(state.notionPageId, 'markLost', 'lead_lost', 'admin', {
    reason: state.adminDecision,
  })

  return {
    status: 'lost',
    lastActivity: new Date().toISOString(),
  }
}
