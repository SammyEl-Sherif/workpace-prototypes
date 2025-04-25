import { HttpServer } from '@/server/types'
import { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export const withWorkPaceServer = (instance: AxiosInstance) => {
  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const { server } = config as AxiosRequestConfig & { server: HttpServer }
    if (server != HttpServer.WorkPace) {
      return config
    }

    config.baseURL = process.env.WORKPACE_API_URL
    Object.entries(config.headers || {}).forEach(([key, value]) => {
      config.headers.set(key, value)
    })

    return {
      ...config,
      baseURL: process.env.WORKPACE_API_URL,
    }
  })
}
