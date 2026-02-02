import https from 'https'

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

import { stringifyQueryParams } from '@/utils/stringifyQueryParams'
import { getSupabaseClient } from '@/utils/supabase/client'

export const createAxiosClient = (config?: AxiosRequestConfig) => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })

  const { ...axiosConfig } = config ?? {}

  const instance = axios.create({
    timeout: 90000,
    httpsAgent,
    withCredentials: true, // Send cookies with requests
    headers: {
      'Content-Type': 'application/json',
      accpet: 'application/json',
    },
    paramsSerializer: (params: any) => stringifyQueryParams(params),
    ...axiosConfig,
  })

  // Add interceptor to include Authorization header from Supabase session
  // This is a fallback in case cookies aren't being sent properly
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Only add Authorization header if we're in the browser
      if (typeof window !== 'undefined') {
        try {
          const supabase = getSupabaseClient()
          const {
            data: { session },
          } = await supabase.auth.getSession()
          
          if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`
          }
        } catch (error) {
          // Silently fail - cookies will be used as fallback
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}
