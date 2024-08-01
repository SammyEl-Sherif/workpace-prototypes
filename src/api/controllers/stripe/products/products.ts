import Stripe from 'stripe'

import { StripeAllProductsDTO } from '@/interfaces/product'
import { HttpClient, HttpResponse } from '@/server/types'
/* Stripe Endpoint: https://docs.stripe.com/api/products/list */
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Use the latest API version
})

export const getStripeProductsController = async (
  httpClient: HttpClient,
  {
    limit,
  }: {
    limit?: number
  }
): Promise<HttpResponse<StripeAllProductsDTO>> => {
  try {
    const productInfo = await stripe.products.list({ limit: limit ?? 3 })
    return {
      data: formatStripeProducts(productInfo),
      status: 200,
    }
  } catch (error) {
    return {
      data: {},
      status: 500,
    }
  }
}

const formatStripeProducts = (productInfo: StripeAllProductsDTO): StripeAllProductsDTO => {
  return {
    ...productInfo,
  }
}
