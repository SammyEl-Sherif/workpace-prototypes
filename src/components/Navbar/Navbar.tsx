import { getAppName } from '@/utils'

import styles from './Navbar.module.scss'

const Navbar = () => {
  return (
    <a href="http://localhost:3000/">
      <div className={styles.container}>
        <h1 className={styles.brandName}>{getAppName()}</h1>
      </div>
    </a>
  )
}

export default Navbar
