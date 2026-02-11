import { useManualFetch } from '@/hooks'
import { Challenge, ChallengeEvidence, CreateChallengeEvidenceInput } from '@/interfaces/challenges'
import { getSupabaseClient } from '@/utils/supabase/client'
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

const ACCEPTED_TYPES = {
  photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
}

const ALL_ACCEPTED = [...ACCEPTED_TYPES.photo, ...ACCEPTED_TYPES.video]

export const EvidenceModal = ({
  isOpen,
  onClose,
  challenge,
  evidenceDate,
  evidence,
  onEvidenceUpdate,
}: EvidenceModalProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const createEvidence = useManualFetch<{ data: { evidence: ChallengeEvidence } }>(
    'good-stuff-list/challenges/evidence'
  )

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

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      // Validate file type
      if (!ALL_ACCEPTED.includes(file.type)) {
        throw new Error('Please upload a photo (JPEG, PNG, GIF, WebP) or video (MP4, MOV, WebM)')
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File must be under 50MB')
      }

      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) {
        throw new Error('You must be signed in to upload files')
      }

      const userId = session.user.id
      const timestamp = Date.now()
      const ext = file.name.split('.').pop() || 'unknown'
      const storagePath = `challenges/${challenge.id}/${userId}/${timestamp}-${file.name}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('challenge-evidence')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('challenge-evidence')
        .getPublicUrl(storagePath)

      const mediaType: 'photo' | 'video' = ACCEPTED_TYPES.photo.includes(file.type)
        ? 'photo'
        : 'video'

      // Create evidence record
      const input: CreateChallengeEvidenceInput = {
        challenge_id: challenge.id,
        evidence_date: evidenceDate,
        file_name: file.name,
        storage_path: storagePath,
        media_type: mediaType,
        media_url: publicUrlData.publicUrl,
        thumbnail_url: mediaType === 'photo' ? publicUrlData.publicUrl : null,
        file_size_bytes: file.size,
        mime_type: file.type,
        notes: null,
      }

      const [result, apiError] = await createEvidence({
        method: 'post',
        data: input,
      })

      if (apiError) {
        throw apiError
      }

      onEvidenceUpdate()
      setUploadError(null)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    // Reset input
    e.target.value = ''
  }

  if (!isOpen) return null

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <Text variant="headline-md-emphasis">
              {formatDate(evidenceDate)} - Day{' '}
              {Math.floor(
                (new Date(evidenceDate).getTime() - new Date(challenge.start_date).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1}
            </Text>
            <Text variant="body-sm" color="neutral-600">
              {challenge.name}
            </Text>
          </div>
          <Button variant="default-secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className={styles.modalBody}>
          {uploadError && (
            <Box
              marginBottom={200}
              padding={200}
              style={{ background: '#fee', borderRadius: '8px' }}
            >
              <Text variant="body-md" color="error-700">
                {uploadError}
              </Text>
            </Box>
          )}

          <Box marginBottom={200}>
            <input
              type="file"
              id="evidence-upload"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
            <label htmlFor="evidence-upload">
              <Button
                variant="brand-primary"
                as="span"
                style={{
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  opacity: isUploading ? 0.6 : 1,
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload Evidence'}
              </Button>
            </label>
          </Box>

          {evidence.length === 0 ? (
            <Text variant="body-md" color="neutral-600">
              No evidence submitted for this day yet.
            </Text>
          ) : (
            <div className={styles.evidenceList}>
              {evidence.map((item) => (
                <Card key={item.id} className={styles.evidenceCard}>
                  <Box padding={200}>
                    <div className={styles.evidenceHeader}>
                      <Text variant="body-sm-emphasis">
                        {item.participant_name || 'Participant'}
                      </Text>
                      <Text variant="body-xs" color="neutral-600">
                        {new Date(item.created_at).toLocaleString()}
                      </Text>
                    </div>
                    {item.media_type === 'photo' ? (
                      <img
                        src={item.media_url}
                        alt={item.file_name}
                        className={styles.evidenceImage}
                      />
                    ) : (
                      <video src={item.media_url} controls className={styles.evidenceVideo} />
                    )}
                    {item.notes && (
                      <Text variant="body-sm" color="neutral-700" marginTop={150}>
                        {item.notes}
                      </Text>
                    )}
                  </Box>
                </Card>
              ))}
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
