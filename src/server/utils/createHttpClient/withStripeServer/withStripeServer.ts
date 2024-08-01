import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { HttpServer } from '../../../types/httpClient'

export const withStripeServer = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config) => {
    const { server } = config as AxiosRequestConfig & { server: HttpServer }

    if (server != HttpServer.StripeCheckout) {
      return config
    }
    return {
      ...config,
      baseURL: process.env.STRIPE_CHEKCOUT_BASE_URL || '',
    }
  })
}
