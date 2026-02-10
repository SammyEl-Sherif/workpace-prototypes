import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// ─── Maintenance flag cache ────────────────────────────────────────────
// Simple in-memory cache so we don't hit Supabase on every single request.
// The flag value is cached for CACHE_TTL_MS and refreshed after that.
const CACHE_TTL_MS = 60_000 // 60 seconds

let maintenanceFlagCache: { enabled: boolean; fetchedAt: number } | null = null

/**
 * Check if the `maintenance-overlay` feature flag is enabled via the
 * Supabase PostgREST API. Results are cached for CACHE_TTL_MS.
 */
async function isMaintenanceEnabled(): Promise<boolean> {
  // Return cached value if still fresh
  if (maintenanceFlagCache && Date.now() - maintenanceFlagCache.fetchedAt < CACHE_TTL_MS) {
    return maintenanceFlagCache.enabled
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  const supabaseKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl || !supabaseKey) {
    // Can't check — assume maintenance is OFF so the site stays accessible
    return false
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/feature_flags?key=eq.maintenance-overlay&select=enabled&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    )

    if (!res.ok) {
      console.error('[Middleware] Failed to fetch maintenance flag:', res.status)
      return false
    }

    const rows: { enabled: boolean }[] = await res.json()
    const enabled = rows.length > 0 && rows[0].enabled === true

    // Update cache
    maintenanceFlagCache = { enabled, fetchedAt: Date.now() }
    return enabled
  } catch (error) {
    console.error('[Middleware] Error checking maintenance flag:', error)
    return false
  }
}

/**
 * Check if the given user ID has the "admin" role via the Supabase
 * PostgREST API.
 */
async function isUserAdmin(userId: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_WORKPACE_SUPABASE_URL
  const supabaseKey = process.env.WORKPACE_SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl || !supabaseKey) {
    return false
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/user_roles?user_id=eq.${userId}&role=eq.admin&select=role&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    )

    if (!res.ok) {
      console.error('[Middleware] Failed to fetch user roles:', res.status)
      return false
    }

    const rows: { role: string }[] = await res.json()
    return rows.length > 0
  } catch (error) {
    console.error('[Middleware] Error checking user admin role:', error)
    return false
  }
}

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
    '/docker-compose.yml',
    '/.github',
    '/.vscode',
    '/.idea',
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

  // ─── Maintenance mode gate ───────────────────────────────────────────
  // Pages that should never be blocked by maintenance mode:
  //  - /signin      → users need to be able to sign in as admin
  //  - /maintenance → the maintenance page itself (avoid infinite rewrite)
  //  - /admin/*     → admin pages are protected separately by AdminGuard
  const isExempt =
    pathname === '/signin' || pathname === '/maintenance' || pathname.startsWith('/admin')

  if (!isExempt) {
    const maintenanceOn = await isMaintenanceEnabled()

    if (maintenanceOn) {
      // Determine the cookie name NextAuth uses for the JWT
      const isProduction = process.env.NODE_ENV === 'production'
      const cookieName = isProduction
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token'

      // Try to get user session from the NextAuth JWT
      const token = await getToken({
        req: request,
        secureCookie: isProduction,
        cookieName,
      })

      const userId = (token as any)?.id as string | undefined

      // If there's no session or the user is not an admin → rewrite to /maintenance
      let admin = false
      if (userId) {
        admin = await isUserAdmin(userId)
      }

      if (!admin) {
        const maintenanceUrl = request.nextUrl.clone()
        maintenanceUrl.pathname = '/maintenance'
        return NextResponse.rewrite(maintenanceUrl)
      }
    }
  }

  // Allow landing page (root), sign-in page, design-system, and system-design pages without authentication
  if (
    pathname === '/' ||
    pathname === '/signin' ||
    pathname === '/design-system' ||
    pathname === '/system-design'
  ) {
    return NextResponse.next()
  }

  // Allow all requests through - authentication will be handled by AuthView component
  // which will show an overlay instead of redirecting
  return NextResponse.next()
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
     */
    '/((?!api|_next/static|_next/image|_next/data|static|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
