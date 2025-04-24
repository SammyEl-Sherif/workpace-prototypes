import styles from './SectionContainer.module.scss'
import cn from 'classnames'

type SectionContainerProps = {
  children: React.ReactNode
  className?: string
  border?: boolean
}

export const SectionContainer = ({ children, className, border = true }: SectionContainerProps) => {
  return (
    <div className={cn(styles.section, className, { [styles.outline]: border })}>{children}</div>
  )
}
