import { Auth } from '@/layout'
import '@workpace/design-system/styles'
import '../styles/globals.scss'

import type { AppProps } from 'next/app'

import { UserInfoContextProvider } from '@/contexts/UserInfoContextProvider'
import { PageProps } from '@/interfaces/page-props'
import MainLayout from '@/layout/MainLayout'
import { PrototypesContextProvider } from '@/modules'

export default function App({ Component, pageProps }: AppProps) {
  const { userProfile, prototypes } = pageProps as PageProps

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
