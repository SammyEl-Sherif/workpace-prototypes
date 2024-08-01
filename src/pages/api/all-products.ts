// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getStripeProductsRoute } from '@/api/routes/stripe/products'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getStripeProductsRoute,
})
