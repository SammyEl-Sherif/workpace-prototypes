import { getAppName } from '@/utils'

import styles from './Navbar.module.scss'
import { Button } from '@workpace/design-system'
import { usePocketbaseLogin } from '@/hooks/usePocketbaseLogin'
import { useEffect } from 'react'

const Navbar = () => {
  const { user, isLoading, makeRequest } = usePocketbaseLogin()
  useEffect(() => {
    makeRequest()
  }, [])
  return (
    <a href="http://localhost:3000/">
      <div className={styles.container}>
        <h1 className={styles.brandName}>{getAppName()}</h1>
        <h3 style={{ color: 'white' }}>{user?.email}</h3>
        <button onClick={makeRequest}>sign in</button>
      </div>
    </a>
  )
}

export default Navbar
