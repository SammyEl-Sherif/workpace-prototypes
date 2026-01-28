import { Button } from '@workpace/design-system'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useUser } from '@/hooks'
import { Routes } from '@/interfaces/routes'
import Logo from '@/public/favicon.ico'

import styles from './LandingNavbar.module.scss'

// Type assertion workaround for Button component type issue
const ButtonComponent = Button as any

const LandingNavbar = () => {
  const { data, status } = useSession()
  const { signOut } = useUser()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
  }

  const handleSignIn = () => {
    router.push(Routes.SIGNIN)
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            <Image src={Logo} alt="Logo" className={styles.logo} />
            WorkPace
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link href={Routes.PROTOTYPES} className={styles.navLink}>
            Prototypes
          </Link>
          <Link href={Routes.DESIGN_SYSTEM} className={styles.navLink}>
            Design System
          </Link>
          <Link href={Routes.SYSTEM_DESIGN} className={styles.navLink}>
            System Design
          </Link>
        </div>
        <div className={styles.authSection}>
          {status === 'authenticated' ? (
            <ButtonComponent onClick={handleSignOut} variant="default-secondary">
              Sign Out
            </ButtonComponent>
          ) : (
            <ButtonComponent onClick={handleSignIn} variant="default-secondary">
              Sign In
            </ButtonComponent>
          )}
        </div>
      </div>
    </nav>
  )
}

export default LandingNavbar
