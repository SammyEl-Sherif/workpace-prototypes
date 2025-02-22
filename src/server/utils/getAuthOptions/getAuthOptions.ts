import { GetServerSidePropsContext } from 'next'
import { NextAuthOptions } from 'next-auth'
import Auth0 from 'next-auth/providers/auth0'

export const getAuthOptions = (req: GetServerSidePropsContext['req']): NextAuthOptions => {
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
        console.log('SESSION CALLBACK', token, user, account, profile)
        return token
      },
    },
    cookies: {
      pkceCodeVerifier: {
        name: 'next-auth.pkce.code_verifier',
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      sessionToken: {
        name: 'next-auth.session-token',
        options: {
          httpOnly: true,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      callbackUrl: {
        name: 'next-auth.callback-url',
        options: {
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
      csrfToken: {
        name: 'next-auth.csrf-token',
        options: {
          httpOnly: true,
          sameSite: 'none',
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
