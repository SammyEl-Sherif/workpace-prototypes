import { useState } from 'react'

import { NotionDatabase } from '@/interfaces/notion'
import {
  GenerateReportActions,
  GenerateReportUserPromptInput,
} from '@/modules/AccomplishmentReport/widgets'

import styles from './NotionInsights.module.scss'
import { ExternalLink } from '@/components'

export interface NotionInsightsPageProps {
  databases: NotionDatabase[]
}

const LearnMore = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  return (
    <>
      {isExpanded && (
        <div className={styles.summary}>
          <div>
            <p>
              The initial idea for <strong>The Good Stuff List</strong> was from a recurring piece
              of advice my manager at work woukd give me. This adivce was along the lines of
              &quot;make sure to keep a &apos;good stuff list&apos;, write down all of your
              accomplishments as they happen, and when the time comes for you to represent yourself
              you will be forever greatful as you progress in your career&quot;. I use Notion, so I
              used their API for this demo.
            </p>
          </div>
          <div>
            <p>
              This Prototype is currently in the WIP status, and is fixed to a single{' '}
              <ExternalLink
                href="https://work-pace.notion.site/1c76838c67878105aa7cddf4d95fa59a?v=1c76838c6787809e89d5000cf1ad7803"
                external
              >
                Notion Task Database
              </ExternalLink>
              . If I find that people find this interesting, I will enable users to login to notion
              and select their database of choice.
            </p>
          </div>
        </div>
      )}
      <div className={styles.cardFooter}>
        <h1 style={{ fontSize: '14px', color: 'gray' }}>Last Update: 4/21/2025</h1>
        <button
          onClick={handleExpand}
          style={{
            fontWeight: 'bold',
            alignSelf: 'flex-end',
            width: '80px',
            backgroundColor: 'transparent',
            color: 'black',
            border: 'unset',
          }}
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
        </button>
      </div>
    </>
  )
}

const NotionInsights = () => {
  return (
    <div className={styles.page}>
      <div className={styles.section} id="generate-report-user-prompt">
        <div className={styles.header}>
          <h1 style={{ fontSize: '32px' }}>🥇 The Good Stuff List</h1>
        </div>
        <LearnMore />
      </div>
      <div className={styles.section} id="generate-report-user-prompt">
        <div className={styles.header}>
          <h1 style={{ fontSize: '32px' }}>Report Generator</h1>
        </div>
        <GenerateReportActions />
        <GenerateReportUserPromptInput />
      </div>
      <div className={styles.section} id="generate-report-user-prompt">
        <div className={styles.header}>
          <h1 style={{ fontSize: '32px', paddingBottom: '10px' }}>Feedback</h1>
          <p>
            The comment seciton is not currently functional, this feature is on WorkPace&apos;s
            roadmap and will be available soon.
          </p>
          <div className={styles.section} id="generate-report-user-prompt">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotionInsights
