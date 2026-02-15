import crypto from 'crypto'
import { NextApiRequest } from 'next'

import { ContractsService } from '@/apis/controllers/portal/contracts.service'

export const verifyDocuSignWebhook = (req: NextApiRequest, rawBody: string): boolean => {
  const secret = process.env.DOCUSIGN_WEBHOOK_SECRET
  if (!secret) {
    console.error('[DocuSign Webhook] DOCUSIGN_WEBHOOK_SECRET is not configured')
    return false
  }

  const signature = req.headers['x-docusign-signature-1'] as string
  if (!signature) {
    return false
  }

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const computedSignature = hmac.digest('base64')

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))
}

export const handleEnvelopeStatusChange = async (payload: any): Promise<void> => {
  const envelopeId = payload?.data?.envelopeId || payload?.envelopeId
  const envelopeStatus = payload?.data?.envelopeSummary?.status || payload?.status

  if (!envelopeId) {
    console.warn('[DocuSign Webhook] No envelopeId in payload')
    return
  }

  if (envelopeStatus === 'completed') {
    const signedAt = new Date().toISOString()
    const updated = await ContractsService.updateStatusFromWebhook(envelopeId, 'signed', signedAt)

    if (updated) {
      console.log(`[DocuSign Webhook] Contract ${updated.id} marked as signed`)
    } else {
      console.warn(`[DocuSign Webhook] No contract found for envelope ${envelopeId}`)
    }
  }
}
