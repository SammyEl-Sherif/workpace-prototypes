import { FC } from 'react'

import { Button, Text } from '@workpace/design-system'
import { useRouter } from 'next/router'

import { Routes } from '@/interfaces/routes'

import styles from './AuthOverlay.module.scss'

// Type assertion workaround for Button component type issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ButtonComponent = Button as any

type AuthOverlayProps = {
  children: React.ReactNode
}

const AuthOverlay: FC<AuthOverlayProps> = ({ children }) => {
  const router = useRouter()

  const handleSignIn = () => {
    router.push(Routes.SIGNIN)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>{children}</div>
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <Text variant="headline-md" className={styles.message}>
            You need to sign up to view this page
          </Text>
          <ButtonComponent onClick={handleSignIn} variant="brand-primary">
            Sign In
          </ButtonComponent>
        </div>
      </div>
    </div>
  )
}

export default AuthOverlay
