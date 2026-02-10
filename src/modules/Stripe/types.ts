/**
 * Request body for creating a Stripe Checkout session
 */
export interface CreateCheckoutSessionRequest {
  /** Optional customer email to pre-fill in the checkout form */
  customerEmail?: string
  /** URL to redirect to after successful payment */
  successUrl?: string
  /** URL to redirect to if the user cancels */
  cancelUrl?: string
}

/**
 * Response from creating a Stripe Checkout session
 */
export interface CreateCheckoutSessionResponse {
  /** The Stripe Checkout session URL to redirect the user to */
  url: string
  /** The Stripe Checkout session ID */
  sessionId: string
}

/**
 * Stripe webhook event types we handle
 */
export enum StripeWebhookEvent {
  CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
  CUSTOMER_SUBSCRIPTION_CREATED = 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED = 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
}
