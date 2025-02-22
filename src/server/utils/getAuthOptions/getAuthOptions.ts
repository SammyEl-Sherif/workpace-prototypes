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
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
      sessionToken: {
        name: 'next-auth.session-token',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
      csrfToken: {
        name: 'next-auth.csrf-token',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
      callbackUrl: {
        name: 'next-auth.callback-url',
        options: {
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
      pkceCodeVerifier: {
        name: 'next-auth.pkce.code_verifier',
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    },
  }
}
