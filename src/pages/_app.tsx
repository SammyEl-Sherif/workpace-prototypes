import { Auth } from '@/layout'
import '../styles/globals.scss'
import '@workpace/design-system/styles'

import type { AppProps } from 'next/app'

import { UserInfoContextProvider } from '@/contexts/UserInfoContextProvider'
import { PageProps } from '@/interfaces/page-props'
import { PrototypesContextProvider } from '@/modules'
import NavigationLayout from '@/layout/NavigationLayout'

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
          <NavigationLayout>
            <Component {...pageProps} />
          </NavigationLayout>
        </PrototypesContextProvider>
      </UserInfoContextProvider>
    </Auth>
  )
}
