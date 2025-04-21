import cn from 'classnames'
import styles from './ExternalLink.module.scss'

interface ExternalLinkProps {
  href: string
  external?: boolean
  children: React.ReactNode
  className?: string
}

export const ExternalLink = ({ children, href, external, className }: ExternalLinkProps) => {
  return (
    <a
      className={cn(styles.link, className)}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}
