import { ReactNode } from 'react'

import { SessionProvider } from 'next-auth/react'

import { AuthView } from './AuthView'

type AuthProps = {
  children: ReactNode
}

const Auth = ({ children }: AuthProps) => {
  return (
    <SessionProvider
      basePath="/api/auth"
      refetchInterval={59 * 60} // 59 minutes
    >
      <AuthView>{children}</AuthView>
    </SessionProvider>
  )
}

export default Auth
