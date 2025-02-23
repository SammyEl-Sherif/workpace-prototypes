import { NextResponse } from 'next/server'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

import { Routes } from './interfaces/routes'
import { getAuthCookiesOptions } from './server/utils'

export async function middleware(request: NextRequestWithAuth) {
  return (
    withAuth(
      async () => {
        return NextResponse.next()
      },
      {
        callbacks: {
          authorized: async ({ token }) => {
            if (!token) {
              return false
            }
            return true
          },
        },
        pages: {
          signIn: Routes.SIGNIN,
        },
        cookies: {
          ...getAuthCookiesOptions(),
        },
      }
    ) as (request: NextRequestWithAuth) => void
  )(request)
}

export const config = {
  /* https://nextjs.org/docs/app/building-your-application/routing/middleware#example */
  matcher: [
    '/:path',
    '/((?!api|_next/static|_next/image|_next/data|static|favicon.ico|sitemap.xml|robots.txt|signin).*)',
  ],
}
