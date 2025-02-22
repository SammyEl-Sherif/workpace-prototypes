import { NextAuthOptions } from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'

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
      signIn: '/signin',
    },
    callbacks: {
      async session({ session, token, user }) {
        console.log('SESSION CALLBACK', session, token, user)
        return session
      },
      async jwt({ token, user, account, profile }) {
        console.log('JWT CALLBACK', token, user, account, profile)
        return token
      },
    },
    cookies: {
      sessionToken: {
        name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      csrfToken: {
        name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
      callbackUrl: {
        name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
        options: {
          sameSite: 'lax',
          path: '/',
          secure: true,
        },
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
