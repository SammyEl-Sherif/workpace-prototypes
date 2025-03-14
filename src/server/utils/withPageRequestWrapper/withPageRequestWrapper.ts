import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types'

import { getUser } from '../getUser'

type GetServerSidePropsContextWithQuery = Omit<GetServerSidePropsContext, 'query'> & {
  query: Record<string, string | undefined>
}

export const withPageRequestWrapper = <T extends { [key: string]: any } = { [key: string]: any }>(
  handler: (context: GetServerSidePropsContextWithQuery) => Promise<T>
): GetServerSideProps<T> => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    try {
      const { req } = context
      const props = {
        userProfile: { ...(await getUser(req)) },
        ...(await handler(context as GetServerSidePropsContextWithQuery)),
      }
      return {
        props,
      }
    } catch (error) {
      throw error
    }
  }
}
