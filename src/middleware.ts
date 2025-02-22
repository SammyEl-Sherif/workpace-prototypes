import { NextResponse } from 'next/server'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

export async function middleware(request: NextRequestWithAuth) {
  console.log('COOKIE', request.cookies)
  console.log('HEADERS', request.headers)
  return (
    withAuth(
      async () => {
        return NextResponse.next()
      },
      {
        callbacks: {
          authorized: async ({ token }) => {
            console.log('TOKEN', !token, token, request.nextauth.token)
            if (!token) {
              return false
            }
            return true
          },
        },
        pages: {
          signIn: '/signin',
        },
      }
    ) as (request: NextRequestWithAuth) => void
  )(request)
}

export const config = {
  /* https://nextjs.org/docs/app/building-your-application/routing/middleware#example */
  matcher: [
    '/:path',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|signin).*)',
  ],
}
