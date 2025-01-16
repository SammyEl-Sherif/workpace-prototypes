import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PocketbaseClientSide as pb } from './utils'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const cookie = request.cookies.get('pb_auth')

  if (cookie) {
    try {
      pb.authStore.loadFromCookie(cookie.value)
    } catch (error) {
      pb.authStore.clear()
      response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }))
    }
  }

  return response
}
/* https://nextjs.org/docs/app/building-your-application/routing/middleware#example */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
