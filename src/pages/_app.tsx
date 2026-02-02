import { Auth } from '@/layout'
import '@workpace/design-system/styles'
import '../styles/globals.scss'

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { UserInfoContextProvider } from '@/contexts/UserInfoContextProvider'
import { PageProps } from '@/interfaces/page-props'
import MainLayout from '@/layout/MainLayout'
import { PrototypesContextProvider } from '@/modules'

export default function App({ Component, pageProps }: AppProps) {
  const { userProfile, prototypes } = pageProps as PageProps
  const router = useRouter()

  // Check if current page is the landing page (no auth required)
  const isLandingPage = router.pathname === '/'
  const isSigninPage = router.pathname === '/signin'
  const isDesignSystemPage = router.pathname === '/design-system'
  const isSystemDesignPage = router.pathname === '/system-design'

  // For landing page, render without authentication but with context providers
  if (isLandingPage) {
    return (
      <Auth>
        <UserInfoContextProvider
          userProfile={{
            ...userProfile,
            name: userProfile?.name ?? '',
            email: userProfile?.email ?? '',
          }}
        >
          <PrototypesContextProvider prototypes={prototypes}>
            <Component {...pageProps} />
          </PrototypesContextProvider>
        </UserInfoContextProvider>
      </Auth>
    )
  }

  // For design-system and system-design pages, render with MainLayout (side navigation) but without auth requirement
  if (isDesignSystemPage || isSystemDesignPage) {
    return (
      <Auth>
        <UserInfoContextProvider
          userProfile={{
            ...userProfile,
            name: userProfile?.name ?? '',
            email: userProfile?.email ?? '',
          }}
        >
          <PrototypesContextProvider prototypes={prototypes}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </PrototypesContextProvider>
        </UserInfoContextProvider>
      </Auth>
    )
  }

  // For signin page, render without layout (no navbar) but with context providers
  if (isSigninPage) {
    return (
      <Auth>
        <UserInfoContextProvider
          userProfile={{
            ...userProfile,
            name: userProfile?.name ?? '',
            email: userProfile?.email ?? '',
          }}
        >
          <Component {...pageProps} />
        </UserInfoContextProvider>
      </Auth>
    )
  }

  // For all other pages, require authentication and full context
  return (
    <Auth>
      <UserInfoContextProvider
        userProfile={{
          ...userProfile,
          name: userProfile?.name ?? '',
          email: userProfile?.email ?? '',
        }}
      >
        <PrototypesContextProvider prototypes={prototypes}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </PrototypesContextProvider>
      </UserInfoContextProvider>
    </Auth>
  )
}
