import styles from './SectionContainer.module.scss'
import cn from 'classnames'

type SectionContainerProps = {
  children: React.ReactNode
  className?: string
}

export const SectionContainer = ({ children, className }: SectionContainerProps) => {
  return <div className={cn(styles.section, className)}>{children}</div>
}
