import { interrupt } from '@langchain/langgraph'

import { PipelineState } from '../state'
import { updatePipelineStatus, updatePipelineFields } from '../integrations/notion-pipeline'
import { sendAdminSms, sendClientSms } from '../integrations/pingram'
import { logAuditEvent } from '../utils/audit'
import { ContractsService } from '@/apis/controllers/portal/contracts.service'
import { updateThread } from '../utils/thread-lookup'

export async function generateContract(state: PipelineState): Promise<Partial<PipelineState>> {
  if (!state.orgId) {
    return { error: 'No org_id — cannot generate contract' }
  }

  const contract = await ContractsService.create(state.orgId, 'system', {
    title: `${state.clientName} — Consulting Agreement`,
    signing_method: 'email',
    template_id: process.env.DOCUSIGN_CONTRACT_TEMPLATE_ID || undefined,
    document_url: undefined,
    signer_email: state.clientEmail,
    signer_name: state.clientName,
  })

  await updatePipelineStatus(state.notionPageId, 'Contract Draft')

  await logAuditEvent(state.notionPageId, 'generateContract', 'contract_created', 'system', {
    contractId: contract.id,
  })

  return {
    status: 'contract_draft',
    contractId: contract.id,
    lastActivity: new Date().toISOString(),
  }
}

export async function reviewContract(state: PipelineState): Promise<Partial<PipelineState>> {
  await sendAdminSms(
    `Contract draft ready for ${state.clientName}. Review and reply APPROVE or REVISE.`
  )

  await logAuditEvent(state.notionPageId, 'reviewContract', 'awaiting_approval')

  const decision = interrupt('Contract review required. Reply with approve or revise.') as {
    action: string
  }

  await logAuditEvent(state.notionPageId, 'reviewContract', 'decision_received', 'admin', {
    action: decision.action,
  })

  return {
    adminDecision: decision.action,
    status: decision.action === 'approved' ? 'awaiting_signature' : 'contract_draft',
    lastActivity: new Date().toISOString(),
  }
}

export async function sendContract(state: PipelineState): Promise<Partial<PipelineState>> {
  if (!state.orgId || !state.contractId) {
    return { error: 'Missing org_id or contract_id' }
  }

  const sentContract = await ContractsService.createAndSendEnvelope(state.orgId, state.contractId)

  const envelopeId = sentContract.envelope_id

  // Update the pipeline thread with the envelope ID for webhook lookup
  if (envelopeId) {
    await updateThread(state.notionPageId, { envelopeId })
  }

  await updatePipelineStatus(state.notionPageId, 'Awaiting Signature')
  await updatePipelineFields(state.notionPageId, {
    'Contract Envelope ID': {
      rich_text: [{ text: { content: envelopeId || '' } }],
    } as any,
  })

  await sendClientSms(
    state.clientPhone,
    `Hi ${state.clientName}, your contract has been sent for signature. Please check your email for the DocuSign document.`
  )

  await logAuditEvent(state.notionPageId, 'sendContract', 'contract_sent', 'system', {
    envelopeId,
    contractId: state.contractId,
  })

  return {
    status: 'awaiting_signature',
    contractEnvelopeId: envelopeId,
    lastActivity: new Date().toISOString(),
  }
}
