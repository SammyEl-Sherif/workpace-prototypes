import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

import { Routes } from './interfaces/routes'
import { getAuthCookiesOptions } from './server/utils'

export async function middleware(request: NextRequestWithAuth) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes - they handle their own authentication
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Security: Block common security scan paths
  const blockedPaths = [
    '/.git',
    '/.env',
    '/.env.local',
    '/.env.production',
    '/.env.development',
    '/.git/config',
    '/.git/HEAD',
    '/.git/logs',
    '/.git/index',
    '/.git/refs',
    '/.gitignore',
    '/.gitattributes',
    '/.dockerignore',
    '/Dockerfile',
    '/docker-compose.yml',
    '/.github',
    '/.vscode',
    '/.idea',
    '/k8s',
    '/.kubeconfig',
  ]

  // Check if path starts with any blocked path
  if (blockedPaths.some((blocked) => pathname.startsWith(blocked) || pathname === blocked)) {
    console.warn(
      `[Security] Blocked access attempt to: ${pathname} from ${
        request.headers.get('referer') || 'unknown'
      }`
    )
    return new NextResponse('Not Found', { status: 404 })
  }

  // Allow design-system page without authentication
  if (pathname === '/design-system') {
    return NextResponse.next()
  }

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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (data files)
     * - static (static files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO files)
     * - signin (sign-in page)
     * - design-system (design system page)
     */
    '/((?!api|_next/static|_next/image|_next/data|static|favicon.ico|sitemap.xml|robots.txt|signin|design-system).*)',
  ],
}
