import { getStripeClient } from './stripeClient'
import { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from './types'

/**
 * Creates a Stripe Checkout Session for the Pro monthly subscription.
 *
 * Requires the following environment variables:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_PRO_PRICE_ID: The Price ID for the Pro plan ($10/mo)
 */
export const createCheckoutSession = async (
  params: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  const stripe = getStripeClient()

  const priceId = process.env.STRIPE_PRO_PRICE_ID

  if (!priceId) {
    throw new Error(
      'Missing STRIPE_PRO_PRICE_ID environment variable. ' +
        'Create a recurring price in your Stripe Dashboard and set the Price ID.'
    )
  }

  const successUrl = params.successUrl || `${getOriginFallback()}/templates?checkout=success`
  const cancelUrl = params.cancelUrl || `${getOriginFallback()}/#templates`

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    ...(params.customerEmail && { customer_email: params.customerEmail }),
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      plan: 'pro',
    },
  })

  if (!session.url) {
    throw new Error('Stripe did not return a checkout session URL')
  }

  return {
    url: session.url,
    sessionId: session.id,
  }
}

/**
 * Fallback origin for server-side URL construction.
 * Uses NEXTAUTH_URL if available, otherwise defaults to localhost.
 */
function getOriginFallback(): string {
  if (process.env.NEXTAUTH_URL) {
    try {
      return new URL(process.env.NEXTAUTH_URL).origin
    } catch {
      // Fall through
    }
  }
  return process.env.NODE_ENV === 'production' ? 'https://workpace.io' : 'http://localhost:3000'
}
