import { useManualFetch } from '@/hooks'
import { Challenge, ChallengeEvidence, CreateChallengeEvidenceInput } from '@/interfaces/challenges'
import { getSupabaseClient } from '@/utils/supabase/client'
import { Button } from '@workpace/design-system'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import styles from './ChallengeDayGrid.module.scss'

interface ChallengeDayData {
  date: Date
  dateKey: string
  dayNumber: number
  evidence: ChallengeEvidence[]
  isToday: boolean
  isPast: boolean
  isFuture: boolean
}

interface ChallengeDayGridProps {
  challenge: Challenge
  evidence: ChallengeEvidence[]
  onDayClick: (dateKey: string) => void
  onEvidenceUpdate: () => void
}

const getColorLevel = (count: number): number => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count >= 3 && count < 5) return 3
  return 4
}

export const ChallengeDayGrid = ({
  challenge,
  evidence,
  onDayClick,
  onEvidenceUpdate,
}: ChallengeDayGridProps) => {
  const [uploadingDate, setUploadingDate] = useState<string | null>(null)
  const createEvidence = useManualFetch<{ data: { evidence: ChallengeEvidence } }>(
    'good-stuff-list/challenges/evidence'
  )

  // Generate days from start_date for duration_days
  const days = useMemo(() => {
    const result: ChallengeDayData[] = []
    const start = new Date(challenge.start_date)
    start.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Generate exactly duration_days number of days
    for (let i = 0; i < challenge.duration_days; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(start.getDate() + i)
      const dateKey = currentDate.toISOString().split('T')[0]
      const dayEvidence = evidence.filter((e) => e.evidence_date === dateKey)
      const isToday = currentDate.toDateString() === today.toDateString()
      const isPast = currentDate < today
      const isFuture = currentDate > today

      result.push({
        date: currentDate,
        dateKey,
        dayNumber: i + 1,
        evidence: dayEvidence,
        isToday,
        isPast,
        isFuture,
      })
    }

    return result
  }, [challenge.start_date, challenge.duration_days, evidence])

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const handleFileUpload = async (dateKey: string, file: File) => {
    setUploadingDate(dateKey)

    try {
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

      const mediaType: 'photo' | 'video' = file.type.startsWith('image/') ? 'photo' : 'video'

      // Create evidence record
      const input: CreateChallengeEvidenceInput = {
        challenge_id: challenge.id,
        evidence_date: dateKey,
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
    } catch (err: any) {
      console.error('Upload error:', err)
      alert(err.message || 'Upload failed')
    } finally {
      setUploadingDate(null)
    }
  }

  const handleSquareClick = (day: ChallengeDayData, e: React.MouseEvent) => {
    // If clicking on upload button, don't open modal
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onDayClick(day.dateKey)
  }

  const handleFileInputChange = (day: ChallengeDayData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(day.dateKey, file)
    }
    // Reset input
    e.target.value = ''
  }

  // Calculate grid columns based on number of days (aim for roughly square grid)
  const gridColumns = useMemo(() => {
    const totalDays = days.length
    if (totalDays <= 7) return 7
    if (totalDays <= 14) return 7
    if (totalDays <= 21) return 7
    if (totalDays <= 30) return 10
    if (totalDays <= 60) return 12
    return Math.ceil(Math.sqrt(totalDays))
  }, [days.length])

  return (
    <div className={styles.container}>
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
        {days.map((day, index) => {
          const count = day.evidence.length
          const level = getColorLevel(count)
          const hasEvidence = count > 0
          const isUploading = uploadingDate === day.dateKey

          return (
            <motion.div
              key={day.dateKey}
              className={`${styles.square} ${styles[`level${level}`]} ${
                day.isToday ? styles.today : ''
              } ${day.isPast ? styles.past : ''} ${day.isFuture ? styles.future : ''} ${
                hasEvidence ? styles.hasEvidence : ''
              }`}
              onClick={(e) => handleSquareClick(day, e)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.2,
                delay: index * 0.01,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.05 }}
              title={`Day ${day.dayNumber} - ${formatDate(day.date)} - ${count} submission${
                count !== 1 ? 's' : ''
              }`}
            >
              {hasEvidence && day.evidence[0]?.thumbnail_url && (
                <img
                  src={day.evidence[0].thumbnail_url}
                  alt={`Evidence for ${day.dateKey}`}
                  className={styles.evidenceThumbnail}
                />
              )}
              {count > 0 && <span className={styles.countBadge}>{count}</span>}
              {day.isToday && count === 0 && <span className={styles.todayDot} />}
              {!day.isFuture && (
                <div className={styles.uploadButton}>
                  <input
                    type="file"
                    id={`upload-${day.dateKey}`}
                    accept="image/*,video/*"
                    onChange={(e) => handleFileInputChange(day, e)}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor={`upload-${day.dateKey}`}>
                    <Button
                      variant="default-secondary"
                      onClick={(e) => e.stopPropagation()}
                      disabled={isUploading}
                    >
                      {isUploading ? '...' : '+'}
                    </Button>
                  </label>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={styles.legendSquares}>
          <div className={`${styles.legendSquare} ${styles.level0}`} />
          <div className={`${styles.legendSquare} ${styles.level1}`} />
          <div className={`${styles.legendSquare} ${styles.level2}`} />
          <div className={`${styles.legendSquare} ${styles.level3}`} />
          <div className={`${styles.legendSquare} ${styles.level4}`} />
        </div>
        <span className={styles.legendLabel}>More</span>
      </div>
    </div>
  )
}
