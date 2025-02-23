import type { NextAuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Auth0 from 'next-auth/providers/auth0'

import { Routes } from '@/interfaces/routes'

import { getAuthCookiesOptions } from '../getAuthCookiesOptions'


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
      async session({ session, token }: { session: Session; token: JWT }) {
        if (session.user && 'image' in session.user && typeof session.user.image === 'undefined') {
          session.user.image = null
        }
        return session
      },
      async redirect({ url, baseUrl }) {
        return baseUrl
      },
    },
    logger: {
      error(code, metadata) {
        console.error(code, metadata)
      },
      warn(code) {
        console.warn(code)
      },
      debug(code, metadata) {
        console.debug(code, metadata)
      },
    },
  }
}
