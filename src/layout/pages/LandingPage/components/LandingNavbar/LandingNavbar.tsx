import Link from 'next/link'
import styles from './LandingNavbar.module.scss'

const LandingNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLink}>
            WorkPace
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link href="/prototypes" className={styles.navLink}>
            Prototypes
          </Link>
          {/* <a href="#community" className={styles.navLink}>
            Community
          </a> */}
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
          <Link href="/signin" className={styles.signInButton}>
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default LandingNavbar
