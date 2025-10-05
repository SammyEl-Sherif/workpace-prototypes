import { NextAuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Auth0 from 'next-auth/providers/auth0'

import { Routes } from '@/interfaces/routes'
import { SessionAccount } from '@/interfaces/user'

import { getAuthCookiesOptions } from './getAuthCookiesOptions'
import { getDecodedJWT } from '../getDecodedJWT'

export const getAuthOptions = (): NextAuthOptions => {
  const maxAge = 60 * 60 // 1h
  const providers = [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      authorization: {
        params: {
          scope: process.env.AUTH0_SCOPE,
          audience: process.env.AUTH0_AUDIENCE,
        },
      },
    }),
  ]

  return {
    providers,
    session: {
      strategy: 'jwt',
      maxAge,
    },
    jwt: {
      maxAge,
    },
    pages: {
      signIn: Routes.SIGNIN,
    },
    cookies: {
      ...getAuthCookiesOptions(),
    },
    callbacks: {
      async session({
        session,
        token,
      }: { session: Session; token: JWT & { account: SessionAccount } } | any) {
        session.account = token?.account
        if (session.user && 'image' in session.user && typeof session.user.image === 'undefined') {
          session.user.image = null
        }
        const { roles } = getDecodedJWT(session.account.access_token)
        session.roles = roles
        return session
      },
      async jwt({ token, account }) {
        if (account) {
          token.account = account
        }
        return token
      },
    },
  }
}
