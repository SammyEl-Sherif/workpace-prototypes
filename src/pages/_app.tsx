import { Auth } from '@/layout'
import '../styles/globals.scss'
import '@workpace/design-system/styles'

import type { AppProps } from 'next/app'

import { UserInfoContextProvider } from '@/contexts/UserInfoContextProvider'
import { PageProps } from '@/interfaces/page-props'

export default function App({ Component, pageProps }: AppProps) {
  const { userProfile } = pageProps as PageProps
  return (
    <Auth>
      <UserInfoContextProvider userProfile={userProfile}>
        <Component {...pageProps} />
      </UserInfoContextProvider>
    </Auth>
  )
}
