import { interrupt } from '@langchain/langgraph'

import { PipelineState } from '../state'
import { updatePipelineStatus, updatePipelineFields } from '../integrations/notion-pipeline'
import { sendClientSms, sendClientEmail, sendAdminSms } from '../integrations/pingram'
import { logAuditEvent } from '../utils/audit'

const PORTAL_BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export async function sendPortalInvite(state: PipelineState): Promise<Partial<PipelineState>> {
  const portalLink = `${PORTAL_BASE_URL}/portal/signup?ref=${state.notionPageId}`

  await sendClientSms(
    state.clientPhone,
    `Hi ${state.clientName}, welcome! Please create your account to get started: ${portalLink}`
  )

  await sendClientEmail(
    state.clientEmail,
    state.clientPhone,
    `Hi ${state.clientName}, we're excited to work with you! Please sign up for your client portal to begin the onboarding process: ${portalLink}`
  )

  await updatePipelineStatus(state.notionPageId, 'Portal Invite Sent')
  await updatePipelineFields(state.notionPageId, {
    'Portal Link': { url: portalLink } as any,
  })

  await logAuditEvent(state.notionPageId, 'sendPortalInvite', 'portal_invite_sent', 'system', {
    portalLink,
  })

  return {
    status: 'portal_invite_sent',
    portalLink,
    lastActivity: new Date().toISOString(),
  }
}

export async function approveAccount(state: PipelineState): Promise<Partial<PipelineState>> {
  await logAuditEvent(state.notionPageId, 'approveAccount', 'awaiting_signup', 'system')

  const decision = interrupt('Waiting for client portal signup and admin approval.') as {
    action: string
    orgId?: string
  }

  if (decision.action === 'account_created' && decision.orgId) {
    await sendAdminSms(
      `${state.clientName} has signed up for the portal. Please review and approve their account.`
    )

    await logAuditEvent(state.notionPageId, 'approveAccount', 'signup_received', 'system', {
      orgId: decision.orgId,
    })

    // Wait for admin approval
    const _approval = interrupt('Client has signed up. Approve their account to continue.') as {
      action: string
    }

    await logAuditEvent(state.notionPageId, 'approveAccount', 'account_approved', 'admin')

    await updatePipelineStatus(state.notionPageId, 'Intake Pending')

    return {
      status: 'account_created',
      portalSignupComplete: true,
      orgId: decision.orgId,
      lastActivity: new Date().toISOString(),
    }
  }

  return {
    lastActivity: new Date().toISOString(),
  }
}
