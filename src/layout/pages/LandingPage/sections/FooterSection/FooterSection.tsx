import { Divider, Text } from '@workpace/design-system'
import Image from 'next/image'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'
import Logo from '@/public/favicon.ico'

import styles from './FooterSection.module.scss'

const FooterSection = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              <Image src={Logo} alt="WorkPace" className={styles.logo} />
              <Text as="span" variant="headline-sm" className={styles.brandName}>
                WorkPace
              </Text>
            </Link>
            <Text as="p" variant="body-sm-paragraph" className={styles.brandDescription}>
              Transforming workspaces with smart solutions, from Notion templates to custom software
              development.
            </Text>
          </div>

          {/* Link Groups */}
          <div className={styles.linkGroup}>
            <Text as="h4" variant="body-md-emphasis" className={styles.linkTitle}>
              Services
            </Text>
            <ul className={styles.linkList}>
              <li>
                <Link href={Routes.TEMPLATES} className={styles.link}>
                  Notion Templates
                </Link>
              </li>
              <li>
                <Link href={Routes.ABOUT} className={styles.link}>
                  Notion Consulting
                </Link>
              </li>
              <li>
                <Link href={Routes.APPS} className={styles.link}>
                  Software Products
                </Link>
              </li>
              <li>
                <Link href={Routes.ABOUT} className={styles.link}>
                  Software Consulting
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <Text as="h4" variant="body-md-emphasis" className={styles.linkTitle}>
              Resources
            </Text>
            <ul className={styles.linkList}>
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
            <Text as="h4" variant="body-md-emphasis" className={styles.linkTitle}>
              Connect
            </Text>
            <div className={styles.socialLinks}>
              <a
                href="https://x.com/SammyElSherif"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
              >
                𝕏
              </a>
              <a
                href="https://www.linkedin.com/in/sammy-el-sherif/"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://github.com/workpace"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                GH
              </a>
            </div>
            <Text as="p" variant="body-sm" className={styles.email}>
              hello@workpace.io
            </Text>
          </div>
        </div>

        <Divider className={styles.divider} />

        <div className={styles.bottom}>
          <Text as="p" variant="body-xs" className={styles.copyright}>
            © {new Date().getFullYear()} WorkPace Technology. All rights reserved.
          </Text>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>
              Privacy Policy
            </a>
            <a href="#" className={styles.legalLink}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
