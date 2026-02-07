import https from 'https'

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

import { stringifyQueryParams } from '@/utils/stringifyQueryParams'
import { getSupabaseClient } from '@/utils/supabase/client'

// Track if a refresh is in progress to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

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

  // Add response interceptor to handle token refresh on 401 errors
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

      // Only handle 401 errors and avoid infinite loops
      // Also skip refresh endpoint itself to prevent infinite refresh loops
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/api/auth/supabase/refresh')
      ) {
        // If we're already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token?: string) => {
                if (token && originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                instance(originalRequest)
                  .then((response) => resolve(response))
                  .catch((err) => reject(err))
              },
              reject: (err?: any) => reject(err || error),
            })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        // Only attempt refresh in the browser
        if (typeof window !== 'undefined') {
          try {
            // Call the refresh endpoint
            const refreshResponse = await axios.post(
              '/api/auth/supabase/refresh',
              {},
              {
                withCredentials: true,
              }
            )

            if (refreshResponse.data?.data?.session?.access_token) {
              const newAccessToken = refreshResponse.data.data.session.access_token

              // Update Supabase client session
              const supabase = getSupabaseClient()
              await supabase.auth.setSession({
                access_token: newAccessToken,
                refresh_token: refreshResponse.data.data.session.refresh_token,
              })

              // Update the original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
              }

              // Process queued requests with the new token
              processQueue(null, newAccessToken)

              // Retry the original request
              return instance(originalRequest)
            } else {
              throw new Error('No access token in refresh response')
            }
          } catch (refreshError) {
            // Refresh failed - clear session
            processQueue(refreshError, null)

            // Clear Supabase session
            const supabase = getSupabaseClient()
            await supabase.auth.signOut()

            // Return the original error
            return Promise.reject(error)
          } finally {
            isRefreshing = false
          }
        } else {
          // Server-side: can't refresh here, return error
          isRefreshing = false
          return Promise.reject(error)
        }
      }

      // For non-401 errors or if retry already attempted, return the error as-is
      return Promise.reject(error)
    }
  )

  return instance
}
