import { FC, ReactNode, useEffect, useRef } from 'react'

import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

import { Routes } from '@/interfaces/routes'
import { Loading } from '@/components'

type AuthView = {
  children: ReactNode
}

const AuthView: FC<AuthView> = ({ children }) => {
  const { pathname, query, asPath, push } = useRouter()
  const { data: session, status } = useSession()
  const hasTriggeredSignIn = useRef(false)

  useEffect(() => {
    // Only handle sign-in page
    if (pathname !== Routes.SIGNIN) {
      hasTriggeredSignIn.current = false
      return
    }

    // If authenticated, redirect away from sign-in page
    if (status === 'authenticated' && session) {
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')
      if (callbackUrl) {
        push(callbackUrl)
      } else {
        push(Routes.HOME)
      }
      return
    }

    // Don't trigger if we're in the Auth0 callback flow
    // NextAuth callback URLs contain '/api/auth/callback' or have callback parameters
    if (
      asPath.includes('/api/auth/callback') ||
      asPath.includes('code=') ||
      asPath.includes('state=')
    ) {
      return
    }

    // Prevent multiple sign-in triggers
    if (hasTriggeredSignIn.current) {
      return
    }

    // Only trigger sign-in if we're unauthenticated (not loading, as that might be during callback)
    if (status === 'unauthenticated') {
      hasTriggeredSignIn.current = true
      const callback = new URLSearchParams(window.location.search).get('callbackUrl') ?? ''
      const isSignOut = query.signout === 'true'

      signIn(
        'auth0',
        callback ? { callbackUrl: callback } : undefined,
        isSignOut ? { prompt: 'login' } : undefined
      )
    }
  }, [pathname, status, session, query, asPath, push])

  // Show loading on sign-in page
  if (pathname === Routes.SIGNIN) {
    return <Loading fullscreen />
  }

  // Allow all children to render - MainLayout will handle showing the overlay
  // for unauthenticated users on protected routes
  return <>{children}</>
}

export default AuthView
