import { useState } from 'react'

import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { Button } from '@workpace/design-system'
import ReactMarkdown from 'react-markdown'

import { Select } from '@/components'
import { NotionDatabase } from '@/interfaces/notion'
import { HomePageProps } from '@/pages'

import styles from './NotionInsights.module.scss'

type AllAccomplishmentsModalProps = {
  accomplishments: QueryDatabaseResponse[]
}

const AllAccomplishmentsModal = ({ accomplishments }: AllAccomplishmentsModalProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <Button
        label="View All"
        primary={false}
        size="small"
        onClick={() => {
          setShowModal(!showModal)
        }}
      />
      {showModal && (
        <dialog open={showModal} className={styles.overlay}>
          <div className={styles.modal} id="all-accomplishments-insights">
            <h3 style={{ marginBottom: '10px' }}>Accomplishments ({accomplishments.length})</h3>
            {Array.isArray(accomplishments) &&
              accomplishments.map((item, i) => (
                <p style={{ padding: '10px' }} key={i}>
                  <span>
                    {i + 1}. {(item as any).title} |{' '}
                  </span>
                  <span>{(item as any).accomplishmentType}</span>
                </p>
              ))}
            <Button
              label="Close"
              onClick={() => {
                setShowModal(false)
              }}
            />
          </div>
        </dialog>
      )}
    </>
  )
}

const NotionInsights = ({
  props: { accomplishments, response, mocked, databases },
}: HomePageProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.actions}>
        <Select label="Notion Database:">
          {Array.isArray(databases) &&
            databases.map((db: NotionDatabase) => <option key={db.id}>{db.title}</option>)}
        </Select>
        <AllAccomplishmentsModal accomplishments={accomplishments} />
      </div>
      <div className={styles.section} id="prompt">
        <p>
          Tell me how you&apos;d like to showcase your accomplishments, and I&apos;ll craft a
          professional report.
        </p>
        <div className={styles.promptWrapper}>
          <textarea
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '8px',
              border: 'solid black 1px',
              borderRadius: '4px',
              flexGrow: 1,
              boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
              height: '72px',
            }}
            placeholder="Write me a year end self reflection report I can submit to my manager."
          />
          <div className={styles.buttonRight}>
            <Button label="Generate Report" primary={true} size="small" />
          </div>
        </div>
      </div>
      <div className={styles.section} id="automated-year-end-review">
        <ReactMarkdown>{response}</ReactMarkdown>
        <div>Mocked Response: {mocked.toString()}</div>
      </div>
    </div>
  )
}

export default NotionInsights
