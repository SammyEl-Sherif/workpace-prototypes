import { useGoals, useGoodThings, useManualFetch } from '@/hooks'
import {
  CreateGoodThingInput,
  GoodThing,
  GoodThingMedia,
  UpdateGoodThingInput,
} from '@/interfaces/good-things'
import { getSupabaseClient } from '@/utils/supabase/client'
import { Button, InputField, Select, Text } from '@workpace/design-system'
import { useEffect, useRef, useState } from 'react'
import styles from './GoodThingForm.module.scss'

const ACCEPTED_TYPES = {
  photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
}

const ALL_ACCEPTED = [...ACCEPTED_TYPES.photo, ...ACCEPTED_TYPES.video]

interface PendingFile {
  file: File
  previewUrl: string
  mediaType: 'photo' | 'video'
}

interface GoodThingFormProps {
  goodThing?: GoodThing | null
  existingMedia?: GoodThingMedia[]
  defaultDate?: string
  challengeId?: string
  challengeGoalId?: string
  challengeTaskDescription?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const GoodThingForm = ({
  goodThing,
  existingMedia = [],
  defaultDate,
  challengeId,
  challengeGoalId,
  challengeTaskDescription,
  onSuccess,
  onCancel,
}: GoodThingFormProps) => {
  const { goals, isLoading: goalsLoading, refetch: refetchGoals } = useGoals()
  const { refetch: refetchGoodThings } = useGoodThings()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createGoodThing = useManualFetch<{ data: { good_thing: GoodThing } }>(
    'good-stuff-list/good-things'
  )
  const updateGoodThing = useManualFetch<{ data: { good_thing: GoodThing } }>(
    `good-stuff-list/good-things/${goodThing?.id || ''}`
  )
  const createMediaRecord = useManualFetch<{ data: { media: GoodThingMedia } }>(
    'good-stuff-list/good-thing-media'
  )

  const [title, setTitle] = useState(goodThing?.title || challengeTaskDescription || '')
  const [description, setDescription] = useState(goodThing?.description || '')
  const [goalId, setGoalId] = useState<string>(goodThing?.goal_id || challengeGoalId || '')
  const [completionDate, setCompletionDate] = useState(
    goodThing?.completion_date ? goodThing.completion_date.split('T')[0] : defaultDate || ''
  )
  const [newGoalName, setNewGoalName] = useState('')
  const [showNewGoalInput, setShowNewGoalInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Media management state
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [removedMediaIds, setRemovedMediaIds] = useState<Set<string>>(new Set())

  // Existing media minus removed ones
  const displayedExistingMedia = existingMedia.filter((m) => !removedMediaIds.has(m.id))

  useEffect(() => {
    refetchGoals()
  }, [])

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      pendingFiles.forEach((pf) => URL.revokeObjectURL(pf.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createGoal = useManualFetch<{ data: { goal: { id: string } } }>('good-stuff-list/goals')

  const handleCreateGoal = async () => {
    if (!newGoalName.trim()) {
      setError('Goal name is required')
      return
    }

    try {
      const [response, error] = await createGoal({
        method: 'post',
        data: { name: newGoalName.trim() },
      })

      if (error) throw error

      if (response?.data?.goal) {
        await refetchGoals()
        setGoalId(response.data.goal.id)
        setNewGoalName('')
        setShowNewGoalInput(false)
        setError(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create goal')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPending: PendingFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!ALL_ACCEPTED.includes(file.type)) {
        setError('Please upload photos (JPEG, PNG, GIF, WebP) or videos (MP4, MOV, WebM)')
        continue
      }

      if (file.size > 50 * 1024 * 1024) {
        setError('Each file must be under 50MB')
        continue
      }

      const mediaType: 'photo' | 'video' = ACCEPTED_TYPES.photo.includes(file.type)
        ? 'photo'
        : 'video'

      newPending.push({
        file,
        previewUrl: URL.createObjectURL(file),
        mediaType,
      })
    }

    if (newPending.length > 0) {
      setPendingFiles((prev) => [...prev, ...newPending])
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      const removed = prev[index]
      URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleRemoveExistingMedia = (mediaId: string) => {
    setRemovedMediaIds((prev) => new Set(prev).add(mediaId))
  }

  const handleRestoreExistingMedia = (mediaId: string) => {
    setRemovedMediaIds((prev) => {
      const next = new Set(prev)
      next.delete(mediaId)
      return next
    })
  }

  const uploadFiles = async (goodThingId: string) => {
    if (pendingFiles.length === 0) return

    const supabase = getSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error('You must be signed in to upload files')
    }

    const userId = session.user.id

    for (const pending of pendingFiles) {
      const timestamp = Date.now()
      const storagePath = `${userId}/${timestamp}-${pending.file.name}`

      const { error: uploadError } = await supabase.storage
        .from('good-thing-media')
        .upload(storagePath, pending.file, {
          contentType: pending.file.type,
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('good-thing-media')
        .getPublicUrl(storagePath)

      const [, apiError] = await createMediaRecord({
        method: 'post',
        data: {
          good_thing_id: goodThingId,
          file_name: pending.file.name,
          storage_path: storagePath,
          media_type: pending.mediaType,
          media_url: publicUrlData.publicUrl,
          thumbnail_url: pending.mediaType === 'photo' ? publicUrlData.publicUrl : null,
          file_size_bytes: pending.file.size,
          mime_type: pending.file.type,
        },
      })

      if (apiError) {
        throw apiError
      }
    }
  }

  const deleteRemovedMedia = async () => {
    for (const mediaId of Array.from(removedMediaIds)) {
      await fetch(`/api/good-stuff-list/good-thing-media/${mediaId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsSubmitting(true)

    try {
      const input: CreateGoodThingInput | UpdateGoodThingInput = {
        title: title.trim(),
        description: description.trim() || null,
        goal_id: goalId || null,
        challenge_id: challengeId || null,
        completion_date: completionDate || null,
      }

      let goodThingId: string

      if (goodThing) {
        const [response, error] = await updateGoodThing({
          method: 'put',
          data: input,
        })
        if (error) throw error
        goodThingId = goodThing.id
      } else {
        const [response, error] = await createGoodThing({
          method: 'post',
          data: input,
        })
        if (error) throw error
        goodThingId = response?.data?.good_thing?.id || ''
      }

      // Handle media changes
      if (removedMediaIds.size > 0) {
        await deleteRemovedMedia()
      }

      if (pendingFiles.length > 0 && goodThingId) {
        await uploadFiles(goodThingId)
      }

      await refetchGoodThings()
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || `Failed to ${goodThing ? 'update' : 'create'} good thing`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalMedia = displayedExistingMedia.length + pendingFiles.length

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <Text variant="headline-md-emphasis">
          {goodThing ? 'Edit Good Thing' : 'Add Good Thing'}
        </Text>
      </div>

      {error && (
        <div className={styles.error}>
          <Text variant="body-md" color="error-600">
            {error}
          </Text>
        </div>
      )}

      <InputField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        marginBottom={200}
      />

      <div className={styles.textareaContainer}>
        <label className={styles.label}>
          <Text variant="body-md">Description</Text>
        </label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you accomplished..."
          rows={4}
        />
      </div>

      <div className={styles.goalSection}>
        <Select
          label="Goal"
          value={goalId}
          onChange={(e) => {
            if (e.target.value === '__new__') {
              setShowNewGoalInput(true)
              setGoalId('')
            } else {
              setGoalId(e.target.value)
              setShowNewGoalInput(false)
            }
          }}
          placeholder="Select a goal (optional)"
          marginBottom={showNewGoalInput ? 200 : undefined}
        >
          <option value="">No goal</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
          <option value="__new__">+ Create New Goal</option>
        </Select>

        {showNewGoalInput && (
          <div className={styles.newGoalInput}>
            <InputField
              label="New Goal Name"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              marginBottom={200}
            />
            <div className={styles.newGoalActions}>
              <Button
                type="button"
                variant="default-secondary"
                onClick={handleCreateGoal}
                disabled={!newGoalName.trim()}
              >
                Create Goal
              </Button>
              <Button
                type="button"
                variant="default-secondary"
                onClick={() => {
                  setShowNewGoalInput(false)
                  setNewGoalName('')
                  setGoalId('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <InputField
        label="Completion Date"
        type="date"
        value={completionDate}
        onChange={(e) => setCompletionDate(e.target.value)}
        marginBottom={200}
      />

      {/* Media Section */}
      <div className={styles.mediaSection}>
        <div className={styles.mediaSectionHeader}>
          <Text variant="body-md">Photos & Videos{totalMedia > 0 ? ` (${totalMedia})` : ''}</Text>
        </div>

        {(displayedExistingMedia.length > 0 || pendingFiles.length > 0) && (
          <div className={styles.mediaThumbnails}>
            {/* Existing media */}
            {displayedExistingMedia.map((media) => (
              <div key={media.id} className={styles.mediaThumbnailItem}>
                {media.media_type === 'photo' ? (
                  <img
                    src={media.media_url}
                    alt={media.file_name}
                    className={styles.mediaThumbnailImage}
                  />
                ) : (
                  <video src={media.media_url} className={styles.mediaThumbnailImage} muted />
                )}
                <button
                  type="button"
                  className={styles.mediaRemoveButton}
                  onClick={() => handleRemoveExistingMedia(media.id)}
                  title="Remove"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                {media.media_type === 'video' && (
                  <span className={styles.videoIndicator}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                )}
              </div>
            ))}

            {/* Pending files */}
            {pendingFiles.map((pending, index) => (
              <div key={`pending-${index}`} className={styles.mediaThumbnailItem}>
                {pending.mediaType === 'photo' ? (
                  <img
                    src={pending.previewUrl}
                    alt={pending.file.name}
                    className={styles.mediaThumbnailImage}
                  />
                ) : (
                  <video src={pending.previewUrl} className={styles.mediaThumbnailImage} muted />
                )}
                <button
                  type="button"
                  className={styles.mediaRemoveButton}
                  onClick={() => handleRemovePendingFile(index)}
                  title="Remove"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <span className={styles.newBadge}>New</span>
                {pending.mediaType === 'video' && (
                  <span className={styles.videoIndicator}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Removed media (show as dimmed with restore option) */}
        {removedMediaIds.size > 0 && (
          <div className={styles.removedMediaList}>
            {existingMedia
              .filter((m) => removedMediaIds.has(m.id))
              .map((media) => (
                <div key={media.id} className={styles.removedMediaItem}>
                  <Text variant="body-sm" color="neutral-400">
                    {media.file_name} — will be removed
                  </Text>
                  <button
                    type="button"
                    className={styles.restoreButton}
                    onClick={() => handleRestoreExistingMedia(media.id)}
                  >
                    Undo
                  </button>
                </div>
              ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={ALL_ACCEPTED.join(',')}
          onChange={handleFileSelect}
          className={styles.hiddenInput}
          multiple
        />

        <button
          type="button"
          className={styles.addMediaButton}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Add Photo or Video
        </button>
      </div>

      <div className={styles.formActions}>
        <Button type="submit" variant="brand-primary" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? 'Saving...' : goodThing ? 'Update' : 'Add'}
        </Button>
        {onCancel && (
          <Button type="button" variant="default-secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
