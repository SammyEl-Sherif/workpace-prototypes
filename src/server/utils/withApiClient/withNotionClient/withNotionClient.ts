import { Client } from '@notionhq/client'
import { GetServerSidePropsContext } from 'next/types'
import { createNotionClient } from '../../createHttpClient'

export const withNotionClient = <
  TRequest extends GetServerSidePropsContext['req'],
  TResponse extends GetServerSidePropsContext['res'],
  TReturn = void
>(
  handler: (
    req: TRequest,
    res: TResponse,
    notionClient: Client
  ) => Promise<TReturn> /*  | TReturn */
) => {
  return async (request: TRequest, response: TResponse) => {
    const client = createNotionClient()
    return handler(request, response, client)
  }
}
