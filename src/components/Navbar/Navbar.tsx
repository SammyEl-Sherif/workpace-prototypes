import { useState } from 'react'

import { signOut, useSession } from 'next-auth/react'

import { getAppName } from '@/utils'

import styles from './Navbar.module.scss'

const Navbar = () => {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/signin' })
  }
  const { data, status } = useSession()

  return (
    <div className={styles.container}>
      <a href="http://localhost:3000/">
        <h1 className={styles.brandName}>{getAppName()}</h1>
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
