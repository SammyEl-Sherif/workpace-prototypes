import { getAppName } from '@/utils'

import styles from './Navbar.module.scss'

const Navbar = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.brandName}>{getAppName()}</h1>
    </div>
  )
}

export default Navbar
