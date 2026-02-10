import { FC } from 'react'

import styles from './PageHeader.module.scss'

type PageHeaderProps = {
  title: string
  subtitle?: string
}

const PageHeader: FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}

export default PageHeader
