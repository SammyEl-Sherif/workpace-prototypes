import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

import { Routes } from '@/interfaces/routes'
import Logo from '@/public/favicon.ico'
import { getAppName } from '@/utils'

import styles from './Navbar.module.scss'
const Navbar = () => {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: Routes.SIGNIN })
  }
  const { data, status } = useSession()

  const isProd = process.env.NODE_ENV === 'production'

  return (
    <div className={styles.container}>
      <a
        className={styles.brandContainer}
        href={isProd ? 'https://workpace.io/' : 'http://localhost:3000/'}
      >
        <h1 className={styles.brandName}>{getAppName()}</h1>
        <Image src={Logo} alt="Logo" className={styles.logo} />
      </a>
      <div className={styles.authStatus}>
        {status === 'authenticated' ? <>{data?.user?.name}</> : <>🚫</>}
        {status === 'authenticated' ? (
          <button onClick={handleSignOut} className={styles.button}>
            Sign out
          </button>
        ) : (
          <button onClick={() => (window.location.href = '/login')}>Sign In</button>
        )}
      </div>
    </div>
  )
}

export default Navbar
