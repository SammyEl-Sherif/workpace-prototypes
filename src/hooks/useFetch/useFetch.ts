import { useEffect, useState } from 'react'

import { HttpError } from '@/models'

import { useDebounce } from '../useDebounce'
import { useEvent } from '../useEvent'
import { RequestConfig, useManualFetch } from '../useManualFetch'

export const useFetch = <T, K>(
  url: string | null,
  {
    method = 'post',
    params,
    delay,
    signOutOnUnauthorizedRequest,
    interceptors,
    manual = false,
    ...config
  }: RequestConfig & {
    delay?: number
    signOutOnUnauthorizedRequest?: boolean
    manual?: boolean
    interceptors?: {
      request: {
        onFulfilled: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
      }[]
    }
  },
  defaultValue: K
): [T | K, boolean, HttpError | Error | null, number | null, () => void] => {
  const [{ response, error, isLoading, statusCode }, setState] = useState<{
    response: T | K
    error: HttpError | Error | null
    isLoading: boolean
    statusCode: number | null
  }>({ response: defaultValue, error: null, isLoading: false, statusCode: null })
  const fetcher = useManualFetch<T>('', { signOutOnUnauthorizedRequest, interceptors })

  const makeRequest = async () => {
    setState((state) => ({ ...state, isLoading: true, error: null }))
    const [data, error, status, isCancelled] = await fetcher({
      url: url as string,
      ...config,
      method,
      data: config.data,
      params,
    })

    if (!isCancelled) {
      setState((state) => ({
        ...state,
        response: data ?? defaultValue,
        error,
        isLoading: false,
        statusCode: status,
      }))
    }
  }

  const handleMakeRequest = useEvent(() => {
    if (url) {
      makeRequest()
    }
  })

  const handleMakeRequestWithDelay = useDebounce(handleMakeRequest, delay ?? 0)

  useEffect(() => {
    if (url && !manual) {
      if (typeof delay != 'undefined') {
        handleMakeRequestWithDelay()
      } else {
        handleMakeRequest()
      }
    }
  }, [url, params, config.data, manual])

  return [response, isLoading, error, statusCode, handleMakeRequest]
}
