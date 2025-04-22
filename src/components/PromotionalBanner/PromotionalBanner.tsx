import styles from './PromotionalBanner.module.scss'

const PromotionalBanner = () => {
  return (
    <div className={styles.banner}>
      <span>
        Hello!👋 Welcome to our beta platform! We value your feedback and would love to hear your
        thoughts at&nbsp;
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

export default PromotionalBanner
