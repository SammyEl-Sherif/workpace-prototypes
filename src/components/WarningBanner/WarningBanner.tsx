import styles from './WarningBanner.module.scss'

const WarningBanner = () => {
  return (
    <div className={styles.banner}>
      <span>
        ⚠️ <strong>Warning:</strong> This site is under active development and may be unstable. For
        critical issues, please contact{' '}
        <span>
          <a href="mailto:support@workpace.io" className={styles.link}>
            support@workpace.io
          </a>
        </span>
        .
      </span>
    </div>
  )
}

export default WarningBanner
