import { useState } from 'react'

import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import ReactMarkdown from 'react-markdown'

import { Select } from '@/components'
import { NotionDatabase } from '@/interfaces/notion'
import { HomePageProps } from '@/pages'
import { Button } from '@workpace/design-system'

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
        primary={true}
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
      <div
        style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          display: 'flex',
          flexFlow: 'row nowrap',
          gap: '1rem',
        }}
      >
        <Select>
          {Array.isArray(databases) &&
            databases.map((db: NotionDatabase) => <option key={db.id}>{db.title}</option>)}
        </Select>
        <AllAccomplishmentsModal accomplishments={accomplishments} />
      </div>
      <div className={styles.section} id="automated-year-end-review">
        <ReactMarkdown>{response}</ReactMarkdown>
        <div>Mocked Response: {mocked.toString()}</div>
      </div>
    </div>
  )
}

export default NotionInsights
