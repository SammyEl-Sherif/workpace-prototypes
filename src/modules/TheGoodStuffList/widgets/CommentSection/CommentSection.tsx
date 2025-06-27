import { SectionContainer } from '@/components'
import styles from './CommentSection.module.scss'

export const CommentSection = () => {
  return (
    <SectionContainer>
      <div className={styles.header}>
        <h1 style={{ fontSize: '32px', paddingBottom: '10px' }}>Feedback</h1>
        <p>
          The comment seciton is not currently functional, this feature is on WorkPace&apos;s
          roadmap and will be available soon.
        </p>
        <SectionContainer>
          <div className={styles.feedbackColumns}>
            <div className={styles.profile}>1</div>
            <div className={styles.mainRows}>
              <div className={styles.commentAndDate}>
                <div className={styles.feedbackRow}>
                  <div className={styles.profileName}>Sammy</div>
                  <div>I kinda like this, but I don&apos;t use notion what is that?</div>
                </div>
                <div className={styles.date}>02/24/2025</div>
              </div>
              <div className={styles.actions}>
                <div className={styles.linkGroup}>
                  <a className={styles.link}>Remove</a>
                  <>|</>
                  <a className={styles.link}>Reply</a>
                </div>
                <div className={styles.likeDislike}>
                  <a className={styles.link}>
                    <div>👍 (4)</div>
                  </a>
                  <a className={styles.link}>
                    <div>👎 (2)</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    </SectionContainer>
  )
}
