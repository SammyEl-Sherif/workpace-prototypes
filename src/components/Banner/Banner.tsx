import styles from './Banner.module.scss'
import cn from 'classnames'

export const Banner = ({ type }: { type: 'promotion' | 'warning' }) => {
  switch (type) {
    case 'promotion':
      return (
        <div className={styles.banner}>
          <span>
            <span style={{ fontWeight: 'bold' }}>Hello!👋</span> Welcome to our beta platform! We
            value your feedback and would love to hear your thoughts at&nbsp;
            <span>
              <a href="mailto:support@workpace.io" className={styles.link}>
                support@workpace.io
              </a>
            </span>
            .
          </span>
        </div>
      )
    case 'warning':
      return (
        <div className={cn(styles.banner, styles.warning)}>
          <span>
            ⚠️ <strong>Warning:</strong> This site is under active development and may be unstable.
            For critical issues, please contact{' '}
            <span>
              <a href="mailto:support@workpace.io" className={styles.link}>
                support@workpace.io
              </a>
            </span>
            .
          </span>
        </div>
      )
    default:
      ;<></>
  }
}
