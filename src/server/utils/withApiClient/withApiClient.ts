import { GetServerSidePropsContext } from 'next/types'

import { HttpClient } from '@/server/types/httpClient'

import { createHttpClient } from '../createHttpClient/createHttpClient'

export const withApiClient = <
  TRequest extends GetServerSidePropsContext['req'],
  TResponse extends GetServerSidePropsContext['res'],
  TReturn = void
>(
  handler: (req: TRequest, res: TResponse, httpClient: HttpClient) => Promise<TReturn> | TReturn
) => {
  return async (request: TRequest, response: TResponse) => {
    const client = createHttpClient()
    return handler(request, response, client)
  }
}
