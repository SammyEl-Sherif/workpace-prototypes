import '../styles/globals.scss'
import '@workpace/design-system/styles'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { PocketbaseClientSide as pb } from '../utils'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Load auth state from cookie on client-side
    pb.authStore.loadFromCookie(document.cookie)
  }, [])
  return <Component {...pageProps} />
}
