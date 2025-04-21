import { useState } from 'react'
import styles from './LearnMore.module.scss'
import { ExternalLink } from '@/components'

export const LearnMore = () => {
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
