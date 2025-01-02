import Image from 'next/image'

import { getAppName } from '@/utils'

import styles from './Navbar.module.scss'

const Navbar = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/favicon.ico"
        alt="GDL Logo"
        className={styles.logo}
        width={30}
        height={30}
        priority
      />
      <h1 className={styles.brandName}>{getAppName()}</h1>
    </div>
  )
}

export default Navbar
