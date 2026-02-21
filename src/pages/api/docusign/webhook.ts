import { NextApiRequest, NextApiResponse } from 'next'

import {
  verifyDocuSignWebhook,
  handleEnvelopeStatusChange,
} from '@/apis/controllers/docusign/webhook'

// Disable body parsing so we can access raw body for HMAC verification
export const config = {
  api: {
    bodyParser: false,
  },
}

const getRawBody = (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const rawBody = await getRawBody(req)

    // Verify HMAC signature
    if (!verifyDocuSignWebhook(req, rawBody)) {
      console.warn('[DocuSign Webhook] Invalid signature')
      res.status(401).json({ error: 'Invalid signature' })
      return
    }

    const payload = JSON.parse(rawBody)

    // Process asynchronously — return 200 immediately
    await handleEnvelopeStatusChange(payload)

    res.status(200).json({ received: true })
  } catch (error: unknown) {
    console.error('[DocuSign Webhook] Error:', error)
    res.status(200).json({ received: true })
  }
}
