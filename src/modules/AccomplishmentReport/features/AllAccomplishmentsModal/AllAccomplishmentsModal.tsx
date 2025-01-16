import { useState } from 'react'

import { Button } from '@workpace/design-system'

import { PageSummary } from '@/interfaces/notion'

import styles from './AllAccomplishmentsModal.module.scss'

type AllAccomplishmentsModalProps = {
  pages: PageSummary[]
}

const AllAccomplishmentsModal = ({ pages }: AllAccomplishmentsModalProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <Button
        label={`View All (${pages.length ?? '0'})`}
        primary={false}
        size="small"
        onClick={() => {
          setShowModal(!showModal)
        }}
      />
      {showModal && (
        <dialog open={showModal} className={styles.overlay}>
          <div className={styles.modal} id="all-pages-insights">
            <h3 style={{ marginBottom: '10px' }}>pages ({pages.length})</h3>
            {Array.isArray(pages) &&
              pages.map((item, i) => (
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
