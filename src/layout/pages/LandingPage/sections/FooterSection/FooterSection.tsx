import Link from 'next/link'
import styles from './FooterSection.module.scss'

const FooterSection = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={styles.brandName}>WorkPace</h3>
            <p className={styles.brandDescription}>
              A change of pace in your online workspace. Building the future of productivity through
              innovative prototypes and collaborative community.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Product</h4>
              <ul className={styles.linkList}>
                <li>
                  <Link href="/prototypes" className={styles.link}>
                    Prototypes
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={styles.link}>
                    About
                  </Link>
                </li>
                <li>
                  <a href="#community" className={styles.link}>
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Community</h4>
              <ul className={styles.linkList}>
                <li>
                  <a
                    href="https://www.notion.so/team/join"
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Notion Teamspace
                  </a>
                </li>
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

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Resources</h4>
              <ul className={styles.linkList}>
                <li>
                  <a
                    href="https://docs.workpace.io"
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.workpace.io"
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2024 WorkPace. All rights reserved.</p>
          </div>

          <div className={styles.social}>
            <a
              href="https://twitter.com/workpace"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              🐦
            </a>
            <a
              href="https://linkedin.com/company/workpace"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              💼
            </a>
            <a
              href="https://discord.gg/workpace"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
