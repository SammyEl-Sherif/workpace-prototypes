import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { useUser } from '@/hooks'
import { Routes } from '@/interfaces/routes'

import styles from './LandingNavbar.module.scss'

const LandingNavbar = () => {
  const { data, status } = useSession()
  const { signOut } = useUser()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            WorkPace
          </Link>
        </div>

        <div className={styles.navLinks}>
          {status === 'authenticated' ? (
            <button onClick={handleSignOut} className={styles.signInButton}>
              Sign Out
            </button>
          ) : (
            <Link href={Routes.SIGNIN} className={styles.signInButton}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default LandingNavbar
