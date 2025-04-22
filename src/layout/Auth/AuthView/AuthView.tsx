import { FC, ReactNode, useEffect } from 'react'

import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

import { Routes } from '@/interfaces/routes'
import { Loading } from '@/components/Loading'

type AuthView = {
  children: ReactNode
}

const AuthView: FC<AuthView> = ({ children }) => {
  const { pathname, query } = useRouter()
  const session = useSession()

  useEffect(() => {
    if (pathname !== Routes.SIGNIN) {
      return
    }
    const callback = new URLSearchParams(window.location.search).get('callbackUrl') ?? ''
    const isSignOut = query.signout === 'true'
    signIn(
      'auth0',
      callback ? { callbackUrl: callback } : undefined,
      isSignOut ? { prompt: 'login' } : undefined
    )
  }, [pathname])

  if (pathname === Routes.SIGNIN) {
    return <Loading fullscreen />
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}

export default AuthView
