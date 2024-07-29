import Image from 'next/image'

import styles from './Navbar.module.scss'

const Navbar = () => {
  return (
    <div className={styles.container}>
      <Image
        src="/favicon.ico"
        alt="Workpace Logo"
        className={styles.logo}
        width={100}
        height={24}
        priority
      />
      <Image
        src="/favicon.ico"
        alt="Workpace Logo"
        className={styles.logo}
        width={100}
        height={24}
        priority
      />
    </div>
  )
}

export default Navbar
