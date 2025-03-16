import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types'

import { getPrototypesMetadata } from '../getPrototypesMetadata'
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
      const prototypes = getPrototypesMetadata()
      const props = {
        ...(await handler(context as GetServerSidePropsContextWithQuery)),
        userProfile: { ...(await getUser(req)) },
        prototypes,
      }
      return {
        props,
      }
    } catch (error) {
      throw error
    }
  }
}
