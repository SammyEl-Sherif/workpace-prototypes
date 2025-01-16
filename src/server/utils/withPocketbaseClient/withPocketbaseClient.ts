import { GetServerSidePropsContext } from 'next/types'
import PocketBase from 'pocketbase'
import { PocketbaseServerSide as pbClient } from '@/utils'

export const withPocketbaseClient = <
  TRequest extends GetServerSidePropsContext['req'],
  TResponse extends GetServerSidePropsContext['res'],
  TReturn = void
>(
  handler: (req: TRequest, res: TResponse, pbClient: PocketBase) => Promise<TReturn>
) => {
  return async (request: TRequest, response: TResponse) => {
    return handler(request, response, pbClient)
  }
}
