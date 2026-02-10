import Stripe from 'stripe'

import { getStripeClient } from './stripeClient'
import { StripeWebhookEvent } from './types'

/**
 * Verifies and constructs a Stripe webhook event from the raw request body.
 *
 * Requires STRIPE_WEBHOOK_SECRET environment variable.
 */
export const verifyWebhookSignature = (
  rawBody: string | Buffer,
  signature: string
): Stripe.Event => {
  const stripe = getStripeClient()

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error(
      'Missing STRIPE_WEBHOOK_SECRET environment variable. ' +
        'Set it from your Stripe webhook endpoint signing secret.'
    )
  }

  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
}

/**
 * Handles a verified Stripe webhook event.
 * Extend this function to process subscription lifecycle events
 * (e.g., update user records, grant/revoke access, send emails).
 */
export const handleWebhookEvent = async (event: Stripe.Event): Promise<void> => {
  switch (event.type) {
    case StripeWebhookEvent.CHECKOUT_SESSION_COMPLETED: {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(
        `[Stripe Webhook] Checkout completed — session: ${session.id}, customer: ${session.customer}, email: ${session.customer_email}`
      )
      // TODO: Provision Pro access for the user
      // e.g., update user record in Supabase with subscription status
      break
    }

    case StripeWebhookEvent.CUSTOMER_SUBSCRIPTION_CREATED: {
      const subscription = event.data.object as Stripe.Subscription
      console.log(
        `[Stripe Webhook] Subscription created — id: ${subscription.id}, status: ${subscription.status}`
      )
      break
    }

    case StripeWebhookEvent.CUSTOMER_SUBSCRIPTION_UPDATED: {
      const subscription = event.data.object as Stripe.Subscription
      console.log(
        `[Stripe Webhook] Subscription updated — id: ${subscription.id}, status: ${subscription.status}`
      )
      // TODO: Handle plan changes, cancellations, renewals
      break
    }

    case StripeWebhookEvent.CUSTOMER_SUBSCRIPTION_DELETED: {
      const subscription = event.data.object as Stripe.Subscription
      console.log(`[Stripe Webhook] Subscription deleted — id: ${subscription.id}`)
      // TODO: Revoke Pro access for the user
      break
    }

    case StripeWebhookEvent.INVOICE_PAYMENT_SUCCEEDED: {
      const invoice = event.data.object as Stripe.Invoice
      console.log(
        `[Stripe Webhook] Invoice payment succeeded — id: ${invoice.id}, subscription: ${invoice.parent?.subscription_details?.subscription}`
      )
      break
    }

    case StripeWebhookEvent.INVOICE_PAYMENT_FAILED: {
      const invoice = event.data.object as Stripe.Invoice
      console.log(
        `[Stripe Webhook] Invoice payment failed — id: ${invoice.id}, subscription: ${invoice.parent?.subscription_details?.subscription}`
      )
      // TODO: Notify user of failed payment, consider grace period
      break
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
  }
}
