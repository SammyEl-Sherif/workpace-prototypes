import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types'

type GetServerSidePropsContextWithQuery = Omit<GetServerSidePropsContext, 'query'> & {
  query: Record<string, string | undefined>
}

export const withPageRequestWrapper = <T extends { [key: string]: any } = { [key: string]: any }>(
  handler: (context: GetServerSidePropsContextWithQuery) => Promise<T>
): GetServerSideProps<T> => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    try {
      const { req, res } = context
      const props = {
        user: {
          name: 'Sammy',
        },
        ...(await handler(context as GetServerSidePropsContextWithQuery)),
      }
      return {
        props,
      }
    } catch (error) {
      // log errors here once util is implemented
      // then return a redirect to somewhere
      throw error
    }
  }
}
