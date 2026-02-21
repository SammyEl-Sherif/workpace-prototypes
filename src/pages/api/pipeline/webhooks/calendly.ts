import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

import { createGraph } from '@/langgraph/graph'
import { logAuditEvent } from '@/langgraph/utils/audit'

export const config = {
  api: {
    bodyParser: false,
  },
}

const CALENDLY_WEBHOOK_SECRET = process.env.CALENDLY_WEBHOOK_SECRET ?? ''

const getRawBody = (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function verifyCalendlySignature(rawBody: string, signature: string): boolean {
  if (!CALENDLY_WEBHOOK_SECRET || !signature) return false

  const hmac = crypto.createHmac('sha256', CALENDLY_WEBHOOK_SECRET)
  hmac.update(rawBody)
  const expected = hmac.digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const rawBody = await getRawBody(req)

    const signature = req.headers['calendly-webhook-signature'] as string
    if (CALENDLY_WEBHOOK_SECRET && !verifyCalendlySignature(rawBody, signature)) {
      console.warn('[Calendly Webhook] Invalid signature')
      res.status(401).json({ error: 'Invalid signature' })
      return
    }

    const payload = JSON.parse(rawBody)

    if (payload.event !== 'invitee.created') {
      res.status(200).json({ received: true, skipped: true })
      return
    }

    const invitee = payload.payload
    const clientName = invitee?.name || invitee?.first_name || 'Unknown'
    const clientEmail = invitee?.email || ''
    const clientPhone = invitee?.text_reminder_number || ''
    const meetingDatetime = invitee?.event?.start_time || null

    if (!clientEmail) {
      console.warn('[Calendly Webhook] No email in invitee payload')
      res.status(200).json({ received: true, skipped: true })
      return
    }

    const graph = await createGraph()
    const threadId = crypto.randomUUID()

    // Start the pipeline asynchronously
    graph
      .invoke(
        {
          clientName,
          clientEmail,
          clientPhone,
          source: 'Calendly',
          meetingDatetime,
          status: 'new_lead',
          meetingNotes: null,
          pricingDiscussed: null,
          portalLink: null,
          portalSignupComplete: false,
          orgId: null,
          intakeFormResponses: null,
          scopeOfWorkDraft: null,
          contractId: null,
          contractEnvelopeId: null,
          contractSigned: false,
          contractSignedUrl: null,
          projectPageId: null,
          reminderCount: 0,
          lastActivity: new Date().toISOString(),
          adminDecision: null,
          error: null,
        },
        { configurable: { thread_id: threadId } }
      )
      .catch((error: unknown) => {
        console.error('[Calendly Webhook] Pipeline start error:', error)
      })

    await logAuditEvent(threadId, 'calendly_webhook', 'pipeline_started', 'system', {
      clientName,
      clientEmail,
    })

    res.status(200).json({ received: true, threadId })
  } catch (error: unknown) {
    console.error('[Calendly Webhook] Error:', error)
    res.status(200).json({ received: true })
  }
}
