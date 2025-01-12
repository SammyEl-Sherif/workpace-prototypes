import { useState } from 'react'

import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { Button } from '@workpace/design-system'

import { PageSummary } from '@/interfaces/notion'

import styles from './AllAccomplishmentsModal.module.scss'

type AllAccomplishmentsModalProps = {
  accomplishments: PageSummary[]
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

export default AllAccomplishmentsModal
