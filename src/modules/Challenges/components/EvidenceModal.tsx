import { useManualFetch } from '@/hooks'
import { Challenge, ChallengeEvidence } from '@/interfaces/challenges'
import { GoodThingForm } from '@/modules/GoodThingsList/components/GoodThingForm'
import { Box, Button, Card, Text } from '@workpace/design-system'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './EvidenceModal.module.scss'

interface EvidenceModalProps {
  isOpen: boolean
  onClose: () => void
  challenge: Challenge
  evidenceDate: string
  evidence: ChallengeEvidence[]
  onEvidenceUpdate: () => void
}

export const EvidenceModal = ({
  isOpen,
  onClose,
  challenge,
  evidenceDate,
  evidence,
  onEvidenceUpdate,
}: EvidenceModalProps) => {
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    onEvidenceUpdate()
  }

  if (!isOpen) return null

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderInfo}>
            <Text variant="headline-md-emphasis">{formatDate(evidenceDate)}</Text>
            <Text variant="body-md" color="neutral-600">
              {evidence.length === 0
                ? 'No achievements logged'
                : `${evidence.length} achievement${evidence.length !== 1 ? 's' : ''} from ${
                    new Set(evidence.map((e) => e.participant_user_id)).size
                  } participant${
                    new Set(evidence.map((e) => e.participant_user_id)).size !== 1 ? 's' : ''
                  }`}
            </Text>
            <Text variant="body-sm" color="neutral-600" style={{ marginTop: '4px' }}>
              {challenge.name} — Day{' '}
              {Math.floor(
                (new Date(evidenceDate).getTime() - new Date(challenge.start_date).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1}
            </Text>
          </div>
          <div className={styles.modalHeaderActions}>
            {!showForm && (
              <Button
                variant="brand-primary"
                onClick={() => {
                  setShowForm(true)
                }}
              >
                + Add
              </Button>
            )}
            <Button variant="default-secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className={styles.modalBody}>
          {/* "Add new" form */}
          {showForm && (
            <div className={styles.formContainer}>
              <GoodThingForm
                defaultDate={evidenceDate}
                challengeId={challenge.id}
                challengeGoalId={challenge.goal_id}
                challengeTaskDescription={challenge.task_description}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false)
                }}
              />
            </div>
          )}

          {evidence.length > 0 && (
            <div className={styles.achievementList}>
              {evidence.map((item) => (
                <div key={item.id} className={styles.achievementCard}>
                  <div className={styles.achievementHeader}>
                    <div className={styles.achievementContent}>
                      <Text variant="headline-sm-emphasis">
                        {item.participant_name || 'Participant'}
                      </Text>
                      {item.notes && (
                        <Text variant="body-md" color="neutral-600">
                          {item.notes}
                        </Text>
                      )}
                      <Text variant="body-xs" color="neutral-600" style={{ marginTop: '4px' }}>
                        {new Date(item.created_at).toLocaleString()}
                      </Text>
                    </div>
                  </div>

                  {(item.media_type === 'photo' || item.media_type === 'video') && (
                    <div className={styles.mediaGallery}>
                      <div className={styles.mediaPreview}>
                        {item.media_type === 'photo' ? (
                          <img
                            src={item.media_url}
                            alt={item.file_name}
                            className={styles.mediaFull}
                          />
                        ) : (
                          <video src={item.media_url} controls className={styles.mediaFull} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {evidence.length === 0 && !showForm && (
            <div className={styles.emptyDay}>
              <Text variant="body-md" color="neutral-400">
                Nothing logged for this day yet.
              </Text>
              <Button variant="brand-primary" onClick={() => setShowForm(true)}>
                + Log an Achievement
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}
