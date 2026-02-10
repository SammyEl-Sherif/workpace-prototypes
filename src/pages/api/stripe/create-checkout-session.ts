import { NextApiRequest, NextApiResponse } from 'next'

import { HttpMethod } from '@/interfaces/httpMethod'
import { createCheckoutSession, CreateCheckoutSessionResponse } from '@/modules/Stripe'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import { HttpResponse } from '@/server/types'

/**
 * POST /api/stripe/create-checkout-session
 *
 * Creates a Stripe Checkout Session for the Pro monthly subscription.
 * Returns the checkout URL so the client can redirect.
 *
 * Request body (optional):
 * - customerEmail: string — pre-fill the email in checkout
 * - successUrl: string — override the success redirect URL
 * - cancelUrl: string — override the cancel redirect URL
 */
const createCheckoutSessionRoute = async (
  req: NextApiRequest,
  res: NextApiResponse<HttpResponse<CreateCheckoutSessionResponse>>
) => {
  try {
    const { customerEmail, successUrl, cancelUrl } = req.body ?? {}

    // Build absolute URLs from the request origin if relative paths were provided
    const origin = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`

    const result = await createCheckoutSession({
      customerEmail,
      successUrl: successUrl ? `${origin}${successUrl}` : `${origin}/templates?checkout=success`,
      cancelUrl: cancelUrl ? `${origin}${cancelUrl}` : `${origin}/#templates`,
    })

    res.status(200).json({
      data: result,
      status: 200,
    })
  } catch (error: unknown) {
    console.error('[createCheckoutSession]', error)

    const message = error instanceof Error ? error.message : 'Failed to create checkout session'

    res.status(500).json({
      data: { url: '', sessionId: '' },
      status: 500,
      message,
    } as any)
  }
}

export default apiRequestWrapper({
  [HttpMethod.POST]: createCheckoutSessionRoute,
})
