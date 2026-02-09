import { Auth } from '@/layout'
import '@workpace/design-system/styles'
import '../styles/globals.scss'

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { UserInfoContextProvider } from '@/contexts/UserInfoContextProvider'
import { PageProps } from '@/interfaces/page-props'
import MainLayout from '@/layout/MainLayout'
import { AppsContextProvider } from '@/modules'

export default function App({ Component, pageProps }: AppProps) {
  const { userProfile, apps } = pageProps as PageProps
  const router = useRouter()

  const isLandingPage = router.pathname === '/'
  const isSigninPage = router.pathname === '/signin'

  // Landing page — has its own StandardNavbar, no MainLayout
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
          <AppsContextProvider apps={apps}>
            <Component {...pageProps} />
          </AppsContextProvider>
        </UserInfoContextProvider>
      </Auth>
    )
  }

  // Sign-in page — no layout (no navbar)
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

  // All other pages — MainLayout handles navbar, auth overlay, SubNavbar
  return (
    <Auth>
      <UserInfoContextProvider
        userProfile={{
          ...userProfile,
          name: userProfile?.name ?? '',
          email: userProfile?.email ?? '',
        }}
      >
        <AppsContextProvider apps={apps}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </AppsContextProvider>
      </UserInfoContextProvider>
    </Auth>
  )
}
