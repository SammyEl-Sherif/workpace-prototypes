import { FC, ReactNode, useEffect, useRef } from 'react'

import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import Loading from 'react-loading'

import { PocketbaseClientSide as pbc } from '@/utils'

type AuthView = {
  children: ReactNode
}

const AuthView: FC<AuthView> = ({ children }) => {
  const { pathname } = useRouter()
  const session = useSession()

  useEffect(() => {
    if (pathname !== '/signin') {
      return
    }

    signIn('auth0', { callbackUrl: 'http://localhost:3000/' }, { prompt: 'login' })
  }, [pathname])

  if (session.status === 'loading' || pathname === '/signin') {
    return <Loading />
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}

export default AuthView
