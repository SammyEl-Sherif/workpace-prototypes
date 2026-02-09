import { Session } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { GetServerSidePropsContext } from 'next/types'

import { SessionAccount } from '@/interfaces/user'

import { getAuthCookiesOptions } from '../getAuthOptions/getAuthCookiesOptions'

export const getNextAuthJWT = async <T extends GetServerSidePropsContext['req']>(
  req: T
): Promise<Omit<Session & { account?: SessionAccount; sub?: string }, 'expires'> | null> => {
  const { sessionToken } = getAuthCookiesOptions()
  const session = (await getToken({
    req,
    secureCookie: process.env.NODE_ENV === 'production',
    cookieName: sessionToken.name,
  })) as unknown as (Session['user'] & { account?: SessionAccount }) | null

  if (!session) {
    return null
  }

  return session
}
