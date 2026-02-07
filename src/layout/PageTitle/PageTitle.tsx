import { FC, ReactNode } from 'react'

import styles from './PageTitle.module.scss'

type PageTitleProps = {
  title?: ReactNode
}

const PageTitle: FC<PageTitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
    </div>
  )
}

export default PageTitle
