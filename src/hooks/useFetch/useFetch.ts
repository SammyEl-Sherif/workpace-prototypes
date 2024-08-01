import { HttpError } from '@/models'

import { RequestConfig, useManualFetch } from '../useManualFetch'

export const useFetch = <T, K>(
  url: string | null,
  {
    method = 'post',
    params,
    delay,
    signOutOnUnauthenticedRequest,
    interceptors,
    ...config
  }: RequestConfig & {
    delay?: number
    signOutOnUnauthenticedRequest: boolean
    interceptors?: {
      request: {
        onFulfilled: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
      }[]
    }
  }
): [T | K, boolean, HttpError | Error | null, number | null] => {
  const fetcher = useManualFetch<T>('', { signOutOnUnauthenticedRequest, interceptors })

  const makeRequest = async () => {
    const [data, error, status, isCancelled] = await fetcher({
      url: url as string,
      ...config,
      method,
      data: config.data,
      params,
    })
  }

  return [response, isLoading, error, statusCode]
}
