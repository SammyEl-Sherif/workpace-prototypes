import { Client } from '@notionhq/client'
import { GetServerSidePropsContext } from 'next/types'
import { NextApiRequest } from 'next'
import { createNotionClient } from '../../createHttpClient'
import { getSupabaseSession } from '../../supabase/getSupabaseSession'

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
    // Try to get user ID from session to use their personal Notion token
    const session = await getSupabaseSession(request as unknown as NextApiRequest)
    const userId = session?.user?.id
    const client = await createNotionClient(userId)
    return handler(request, response, client)
  }
}
