import { GetServerSidePropsContext } from 'next/types'
import OpenAI from 'openai'
import { createOpenaiClient } from '../../createHttpClient'

export const withOpenaiClient = <
  TRequest extends GetServerSidePropsContext['req'],
  TResponse extends GetServerSidePropsContext['res'],
  TReturn = void
>(
  handler: (req: TRequest, res: TResponse, openaiClient: OpenAI) => Promise<TReturn>
) => {
  return async (request: TRequest, response: TResponse) => {
    const client = createOpenaiClient()
    return handler(request, response, client)
  }
}
