import { Auth } from '@/layout'
import '@workpace/design-system/styles'
import '../styles/globals.scss'

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { AdminGuard } from '@/components/AdminGuard'
import { PortalGuard } from '@/components/PortalGuard'
import { MaintenanceOverlay } from '@/components/MaintenanceOverlay'
import { FeatureFlagsContextProvider } from '@/contexts/FeatureFlagsContextProvider'
import { PortalContextProvider } from '@/contexts/PortalContextProvider'
import { UserInfoContextProvider } from '@/contexts/UserInfoContextProvider'
import { APPS } from '@/interfaces/apps'
import { PageProps } from '@/interfaces/page-props'
import MainLayout from '@/layout/MainLayout'
import { PortalLayout } from '@/layout/PortalLayout'
import { AppsContextProvider } from '@/modules'

export default function App({ Component, pageProps }: AppProps) {
  const { userProfile, apps } = pageProps as PageProps
  const router = useRouter()

  const isLandingPage = router.pathname === '/'
  const isSigninPage = router.pathname === '/signin'
  const isPortalPage = router.pathname.startsWith('/portal')
  const isPortalSignupPage = router.pathname === '/portal/signup'
  const isAdminPage = router.pathname.startsWith('/admin')
  // Check if this is an error page (statusCode is set by _error.tsx)
  const isErrorPage = 'statusCode' in pageProps

  // Error pages need SessionProvider and UserInfoContextProvider for StandardNavbar
  // but skip MaintenanceOverlay and other providers
  if (isErrorPage) {
    return (
      <Auth>
        <UserInfoContextProvider
          userProfile={{
            name: userProfile?.name ?? '',
            email: userProfile?.email ?? '',
            roles: userProfile?.roles ?? [],
          }}
        >
          <Component {...pageProps} />
        </UserInfoContextProvider>
      </Auth>
    )
  }

  // Shared provider wrapper — UserInfo + FeatureFlags available everywhere
  const withProviders = (content: React.ReactNode) => (
    <Auth>
      <UserInfoContextProvider
        userProfile={{
          ...userProfile,
          name: userProfile?.name ?? '',
          email: userProfile?.email ?? '',
          roles: userProfile?.roles ?? [],
        }}
      >
        <FeatureFlagsContextProvider>
          <MaintenanceOverlay>{content}</MaintenanceOverlay>
        </FeatureFlagsContextProvider>
      </UserInfoContextProvider>
    </Auth>
  )

  // Landing page — has its own StandardNavbar, no MainLayout
  if (isLandingPage) {
    return withProviders(
      <AppsContextProvider apps={apps ?? APPS}>
        <Component {...pageProps} />
      </AppsContextProvider>
    )
  }

  // Sign-in page — no layout (no navbar)
  if (isSigninPage) {
    return withProviders(<Component {...pageProps} />)
  }

  // Portal signup page — no portal guard (needs to be accessible to sign up)
  if (isPortalSignupPage) {
    return withProviders(<Component {...pageProps} />)
  }

  // Portal pages — PortalLayout + PortalGuard (portal membership required)
  if (isPortalPage) {
    return withProviders(
      <PortalContextProvider>
        <PortalLayout>
          <PortalGuard>
            <Component {...pageProps} />
          </PortalGuard>
        </PortalLayout>
      </PortalContextProvider>
    )
  }

  // Admin pages — MainLayout + AdminGuard (admin-only access)
  if (isAdminPage) {
    return withProviders(
      <AppsContextProvider apps={apps ?? APPS}>
        <MainLayout>
          <AdminGuard>
            <Component {...pageProps} />
          </AdminGuard>
        </MainLayout>
      </AppsContextProvider>
    )
  }

  // All other pages — MainLayout handles navbar, auth overlay, SubNavbar
  return withProviders(
    <AppsContextProvider apps={apps ?? APPS}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AppsContextProvider>
  )
}
