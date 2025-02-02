import { FC, ReactNode } from 'react'

type PageTitleProps = {
  title?: ReactNode
}

const PageTitle: FC<PageTitleProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}

export default PageTitle
