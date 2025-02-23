import { FC, ReactNode, useEffect, useRef } from 'react'

import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import Loading from 'react-loading'

import { Routes } from '@/interfaces/routes'

type AuthView = {
  children: ReactNode
}

const AuthView: FC<AuthView> = ({ children }) => {
  const { pathname } = useRouter()
  const session = useSession()

  useEffect(() => {
    if (pathname !== Routes.SIGNIN) {
      return
    }
    const isProd = process.env.NODE_ENV === 'production'
    const callback = new URLSearchParams(window.location.search).get('callbackUrl') ?? ''
    const callbackUrl = isProd
      ? `https://workpace.io/${callback}`
      : `http://localhost:3000/${callback}`

    signIn('auth0', { callbackUrl }, { prompt: 'login' })
  }, [pathname])

  if (session.status === 'loading' || pathname === Routes.SIGNIN) {
    return <Loading />
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}

export default AuthView
