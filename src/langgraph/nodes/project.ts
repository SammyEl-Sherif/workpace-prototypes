import { interrupt } from '@langchain/langgraph'

import { PipelineState } from '../state'
import {
  updatePipelineStatus,
  updatePipelineFields,
  createProjectRecord,
} from '../integrations/notion-pipeline'
import {
  sendAdminSms,
  sendAdminEmail,
  sendClientSms,
  sendClientEmail,
} from '../integrations/pingram'
import { logAuditEvent } from '../utils/audit'
import { updateThread } from '../utils/thread-lookup'

export async function handleSigned(state: PipelineState): Promise<Partial<PipelineState>> {
  await logAuditEvent(state.notionPageId, 'handleSigned', 'awaiting_signature')

  const decision = interrupt('Waiting for DocuSign contract completion webhook.') as {
    action: string
  }

  if (decision.action !== 'signed') {
    return { lastActivity: new Date().toISOString() }
  }

  // Create project in Notion
  const projectPageId = await createProjectRecord({
    clientName: state.clientName,
    scopeOfWork: state.scopeOfWorkDraft || 'See contract for details.',
    pipelinePageId: state.notionPageId,
  })

  // Update pipeline record
  await updatePipelineStatus(state.notionPageId, 'Won')
  await updatePipelineFields(state.notionPageId, {
    Project: { relation: [{ id: projectPageId }] } as any,
  })

  // Update thread status
  await updateThread(state.notionPageId, { status: 'completed' })

  // Notify admin
  await sendAdminSms(`Contract signed by ${state.clientName}! Project created in Notion.`)
  await sendAdminEmail(
    `Contract signed by ${state.clientName}. Project page created. Pipeline complete.`
  )

  // Welcome the client
  await sendClientSms(
    state.clientPhone,
    `Hi ${state.clientName}, thank you for signing! We're excited to get started. You'll receive a project kickoff email shortly.`
  )
  await sendClientEmail(
    state.clientEmail,
    state.clientPhone,
    `Hi ${state.clientName}, welcome aboard! Your contract has been executed and your project is now set up. We'll be in touch soon to schedule our kickoff meeting.`
  )

  await logAuditEvent(state.notionPageId, 'handleSigned', 'project_created', 'system', {
    projectPageId,
  })

  return {
    status: 'active_client',
    contractSigned: true,
    projectPageId,
    lastActivity: new Date().toISOString(),
  }
}
