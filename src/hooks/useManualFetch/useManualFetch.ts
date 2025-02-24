import { useEffect, useRef } from 'react'

import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'

import { HttpError } from '@/models'
import { createAxiosClient } from '@/server/utils/axios/createAxiosClient'

import { useEvent } from '../useEvent/useEvent'

export type RequestConfig = Omit<AxiosRequestConfig, 'method' | 'cancelToken' | 'params'> & {
  method?: NonNullable<AxiosRequestConfig['method']>
  params?: Record<string, string | string[] | number | number[] | boolean | undefined>
}

export type Interceptor = {
  onFulfilled?: (value: RequestConfig) => RequestConfig | Promise<RequestConfig>
  onRejected?: (error: any) => any
}

export const useManualFetch = <T>(
  url: string,
  {
    signOutOnUnauthorizedRequest = true,
    interceptors,
    ...config
  }: Omit<RequestConfig, 'data' | 'params'> & {
    signOutOnUnauthorizedRequest?: boolean
    interceptors?: {
      request: Interceptor[]
    }
  } = {}
): ((
  payload?: RequestConfig
) => Promise<[T | null, HttpError | Error | null, number | null, boolean]>) => {
  const { current: client } = useRef(
    (() => {
      const client = createAxiosClient({ baseURL: '/api/' })

      if (interceptors) {
        interceptors.request.forEach((interceptor) => {
          const { onFulfilled, onRejected } = interceptor

          client.interceptors.request.use(onRejected)
        })
      }

      return client
    })()
  )

  const cancelTokenSource = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    return () => {
      cancelTokenSource.current?.cancel()
    }
  }, [])

  return useEvent(
    async (
      payload: RequestConfig = {}
    ): Promise<[T | null, HttpError | Error | null, number | null, boolean]> => {
      try {
        const { data, status } = await client.request<T>({
          url,
          method: 'get',
          ...config,
          ...payload,
          cancelToken: cancelTokenSource.current?.token,
          headers: {
            ...config.headers,
            ...payload.headers,
          },
        })
        return [data as T, null, status, false]
      } catch (error) {
        return [null, error instanceof Error ? error : new Error(), null, axios.isCancel(error)]
      }
    }
  )
}
