import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

/**
 * Returns a singleton Stripe SDK client for server-side usage.
 * Requires STRIPE_SECRET_KEY to be set in environment variables.
 */
export const getStripeClient = (): Stripe => {
  if (stripeInstance) {
    return stripeInstance
  }

  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error(
      'Missing STRIPE_SECRET_KEY environment variable. ' +
        'Set it in your .env file with your Stripe secret key from https://dashboard.stripe.com/apikeys'
    )
  }

  stripeInstance = new Stripe(secretKey)

  return stripeInstance
}
