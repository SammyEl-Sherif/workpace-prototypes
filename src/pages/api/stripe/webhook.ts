import { NextApiRequest, NextApiResponse } from 'next'

import { verifyWebhookSignature, handleWebhookEvent } from '@/modules/Stripe'

/**
 * POST /api/stripe/webhook
 *
 * Stripe webhook endpoint. Verifies the webhook signature and processes events.
 *
 * IMPORTANT: This route disables the default body parser so we can access
 * the raw request body needed for Stripe signature verification.
 */
export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * Reads the raw request body as a Buffer.
 */
function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const signature = req.headers['stripe-signature']

  if (!signature || typeof signature !== 'string') {
    res.status(400).json({ error: 'Missing stripe-signature header' })
    return
  }

  try {
    const rawBody = await getRawBody(req)
    const event = verifyWebhookSignature(rawBody, signature)

    await handleWebhookEvent(event)

    res.status(200).json({ received: true })
  } catch (error: unknown) {
    console.error('[Stripe Webhook] Error:', error)

    const message = error instanceof Error ? error.message : 'Webhook handler failed'
    res.status(400).json({ error: message })
  }
}
