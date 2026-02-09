import { Routes } from '@/interfaces/routes'
import Link from 'next/link'
import styles from './FooterSection.module.scss'

const FooterSection = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={styles.brandName}>WorkPace</h3>
            <p className={styles.brandDescription}>A change of pace in your online workspace.</p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <div className={styles.linkTitle}>
                <h4 className={styles.linkTitle}>Product</h4>
              </div>
              <ul className={styles.linkList}>
                <li>
                  <Link href={Routes.APPS} className={styles.link}>
                    Apps
                  </Link>
                </li>
                <li>
                  <Link href={Routes.DESIGN_SYSTEM} className={styles.link}>
                    Design System
                  </Link>
                </li>
                <li>
                  <Link href={Routes.SYSTEM_DESIGN} className={styles.link}>
                    System Design
                  </Link>
                </li>
                <li>
                  <Link href={Routes.ABOUT} className={styles.link}>
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <div className={styles.linkTitle}>
                <h4 className={styles.linkTitle}>Community</h4>
              </div>
              <ul className={styles.linkList}>
                {/* <li>
                  <a
                    href="https://www.notion.so/team/join"
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Notion Teamspace
                  </a>
                </li> */}
                <li>
                  <a
                    href="https://github.com/workpace"
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2025 WorkPace Technology. All rights reserved.</p>
          </div>

          <div className={styles.social}>
            <a
              href="https://x.com/SammyElSherif"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              🐦
            </a>
            <a
              href="https://www.linkedin.com/in/sammy-el-sherif/"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              💼
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
