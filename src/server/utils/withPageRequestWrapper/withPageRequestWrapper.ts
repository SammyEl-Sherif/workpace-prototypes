import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types'

export const withPageRequestWrapper = <T extends { [key: string]: any } = { [key: string]: any }>(
  handler: () => Promise<T>
): GetServerSideProps<T> => {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    try {
      const { req, res } = context
      console.log('withPageRequestWrapper', req, res)
      const props = {
        user: {
          name: 'Sammy',
        },
        ...(await handler()),
      }
      return {
        props,
      }
    } catch (error) {
      // log errors here once util is implemented
      // then return a redirect to somewhere
      console.log('[ERROR] withPageRequestWrapper')
      throw error
    }
  }
}
