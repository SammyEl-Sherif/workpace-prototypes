import { useGoals, useGoodThings, useManualFetch } from '@/hooks'
import { GoodThing, GoodThingMedia } from '@/interfaces/good-things'
import { Button, Text } from '@workpace/design-system'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { GoodThingForm } from '../GoodThingForm'
import { MediaUpload } from '../MediaUpload'
import styles from './DayGrid.module.scss'

const GRID_SIZE = 32

interface DayData {
  date: Date
  dateKey: string
  goodThings: GoodThing[]
  media: GoodThingMedia[]
}

interface DayGridProps {
  goodThings: GoodThing[]
  onRefetch: () => void
  showHistory: boolean
  onToggleHistory: () => void
  onAddGoodThing?: () => void
  children?: React.ReactNode
}

export const DayGrid = ({
  goodThings,
  onRefetch,
  showHistory,
  onToggleHistory,
  onAddGoodThing,
  children,
}: DayGridProps) => {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [mediaMap, setMediaMap] = useState<Record<string, GoodThingMedia[]>>({})
  const [selectedGoalId, setSelectedGoalId] = useState<string>('all')

  const { goals, refetch: refetchGoals } = useGoals()

  useEffect(() => {
    refetchGoals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchMedia = useManualFetch<{ data: { media: GoodThingMedia[] } }>(
    'good-stuff-list/good-thing-media'
  )

  // Filter good things by selected goal
  const filteredGoodThings = useMemo(() => {
    if (selectedGoalId === 'all') return goodThings
    return goodThings.filter((gt) => gt.goal_id === selectedGoalId)
  }, [goodThings, selectedGoalId])

  // Generate 32 days (today going back)
  const days = useMemo(() => {
    const result: DayData[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < GRID_SIZE; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (GRID_SIZE - 1 - i))
      const dateKey = date.toISOString().split('T')[0]

      const dayGoodThings = filteredGoodThings.filter((gt) => {
        const gtDate = gt.completion_date
          ? new Date(gt.completion_date).toISOString().split('T')[0]
          : new Date(gt.created_at).toISOString().split('T')[0]
        return gtDate === dateKey
      })

      result.push({
        date,
        dateKey,
        goodThings: dayGoodThings,
        media: mediaMap[dateKey] || [],
      })
    }

    return result
  }, [filteredGoodThings, mediaMap])

  // Fetch media for filtered good things
  useEffect(() => {
    const fetchAllMedia = async () => {
      const newMediaMap: Record<string, GoodThingMedia[]> = {}

      for (const gt of filteredGoodThings) {
        try {
          const [response] = await fetchMedia({
            method: 'get',
            url: `good-stuff-list/good-thing-media/${gt.id}`,
            params: { goodThingId: gt.id },
          })

          if (response?.data?.media && response.data.media.length > 0) {
            const dateKey = gt.completion_date
              ? new Date(gt.completion_date).toISOString().split('T')[0]
              : new Date(gt.created_at).toISOString().split('T')[0]

            if (!newMediaMap[dateKey]) {
              newMediaMap[dateKey] = []
            }
            newMediaMap[dateKey].push(...response.data.media)
          }
        } catch {
          // Skip failed fetches
        }
      }

      setMediaMap(newMediaMap)
    }

    if (filteredGoodThings.length > 0) {
      fetchAllMedia()
    } else {
      setMediaMap({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredGoodThings])

  const handleDayClick = useCallback(
    (day: DayData) => {
      if (selectedDay?.dateKey === day.dateKey) {
        // Toggle off
        setSelectedDay(null)
        setShowForm(false)
        return
      }

      setSelectedDay(day)

      if (day.goodThings.length === 0) {
        setShowForm(true)
      } else {
        setShowForm(false)
      }
    },
    [selectedDay]
  )

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedDay(null)
    onRefetch()
  }

  const handleMediaUploaded = () => {
    onRefetch()
    // Re-fetch media
    setMediaMap({})
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const getSquareContent = (day: DayData) => {
    // If there's media, show it as a thumbnail
    if (day.media.length > 0) {
      const firstMedia = day.media[0]
      if (firstMedia.media_type === 'photo') {
        return (
          <img
            src={firstMedia.media_url}
            alt={firstMedia.file_name}
            className={styles.mediaThumbnail}
          />
        )
      }
      if (firstMedia.media_type === 'video') {
        return <video src={firstMedia.media_url} className={styles.mediaThumbnail} muted />
      }
    }

    return null
  }

  const getColorLevel = (count: number): number => {
    if (count === 0) return 0
    if (count === 1) return 1
    if (count >= 2 && count <= 3) return 2
    if (count >= 4 && count <= 5) return 3
    return 4
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedDay) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedDay])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedDay) {
        setSelectedDay(null)
        setShowForm(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedDay])

  const handleCloseModal = () => {
    setSelectedDay(null)
    setShowForm(false)
  }

  // Day detail modal content
  const dayDetailModal =
    selectedDay && typeof window !== 'undefined'
      ? createPortal(
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderInfo}>
                  <Text variant="headline-md-emphasis">{formatDateFull(selectedDay.date)}</Text>
                  <Text variant="body-md" color="neutral-600">
                    {selectedDay.goodThings.length === 0
                      ? 'No achievements logged'
                      : `${selectedDay.goodThings.length} achievement${
                          selectedDay.goodThings.length !== 1 ? 's' : ''
                        }`}
                  </Text>
                </div>
                <div className={styles.modalHeaderActions}>
                  {!showForm && (
                    <Button variant="brand-primary" onClick={() => setShowForm(true)}>
                      + Add
                    </Button>
                  )}
                  <Button variant="default-secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </div>
              <div className={styles.modalBody}>
                {showForm && (
                  <div className={styles.formContainer}>
                    <GoodThingForm
                      defaultDate={selectedDay.dateKey}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setShowForm(false)}
                    />
                  </div>
                )}

                {selectedDay.goodThings.length > 0 && (
                  <div className={styles.achievementList}>
                    {selectedDay.goodThings.map((gt) => (
                      <div key={gt.id} className={styles.achievementCard}>
                        <div className={styles.achievementContent}>
                          <Text variant="headline-sm-emphasis">{gt.title}</Text>
                          {gt.description && (
                            <Text variant="body-md" color="neutral-600">
                              {gt.description}
                            </Text>
                          )}
                          {gt.goal_name && <span className={styles.goalBadge}>{gt.goal_name}</span>}
                        </div>

                        {selectedDay.media.filter((m) => m.good_thing_id === gt.id).length > 0 && (
                          <div className={styles.mediaGallery}>
                            {selectedDay.media
                              .filter((m) => m.good_thing_id === gt.id)
                              .map((media) => (
                                <div key={media.id} className={styles.mediaPreview}>
                                  {media.media_type === 'photo' ? (
                                    <img
                                      src={media.media_url}
                                      alt={media.file_name}
                                      className={styles.mediaFull}
                                    />
                                  ) : (
                                    <video
                                      src={media.media_url}
                                      controls
                                      className={styles.mediaFull}
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        )}

                        <MediaUpload goodThingId={gt.id} onUploadComplete={handleMediaUploaded} />
                      </div>
                    ))}
                  </div>
                )}

                {selectedDay.goodThings.length === 0 && !showForm && (
                  <div className={styles.emptyDay}>
                    <Text variant="body-md" color="neutral-500">
                      Nothing logged for this day yet.
                    </Text>
                    <Button variant="brand-primary" onClick={() => setShowForm(true)}>
                      + Log an Achievement
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <div className={styles.container}>
      {/* Header — always visible, text switches based on view */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerText}>
            <Text variant="headline-md-emphasis">
              {showHistory ? 'Your Good Things' : 'Daily Achievement Grid'}
            </Text>
            <Text variant="body-md" color="neutral-600">
              {showHistory
                ? 'Browse all your logged achievements'
                : `Last ${GRID_SIZE} days — click a square to view or log achievements`}
            </Text>
          </div>
          <div className={styles.headerControls}>
            <select
              className={styles.goalSelect}
              value={selectedGoalId}
              onChange={(e) => {
                setSelectedGoalId(e.target.value)
                setSelectedDay(null)
                setShowForm(false)
              }}
            >
              <option value="all">All Goals</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
            {showHistory && onAddGoodThing && (
              <button type="button" className={styles.addButton} onClick={onAddGoodThing}>
                + Add Good Thing
              </button>
            )}
            <button
              type="button"
              className={`${styles.historyButton} ${showHistory ? styles.historyButtonActive : ''}`}
              onClick={onToggleHistory}
            >
              {showHistory ? '← Back to Grid' : 'View All History'}
            </button>
          </div>
        </div>
      </div>

      {/* Content — swaps between grid view and history view */}
      <AnimatePresence mode="wait">
        {!showHistory ? (
          <motion.div
            key="grid-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.grid}>
              {days.map((day, index) => {
                const count = day.goodThings.length
                const level = getColorLevel(count)
                const hasMedia = day.media.length > 0
                const isSelected = selectedDay?.dateKey === day.dateKey

                return (
                  <motion.button
                    key={day.dateKey}
                    type="button"
                    className={`${styles.square} ${styles[`level${level}`]} ${
                      isToday(day.date) ? styles.today : ''
                    } ${isSelected ? styles.selected : ''} ${hasMedia ? styles.hasMedia : ''}`}
                    onClick={() => handleDayClick(day)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: isSelected ? 1.05 : 1 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.015,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    title={`${formatDate(day.date)} — ${count} achievement${
                      count !== 1 ? 's' : ''
                    }`}
                  >
                    {getSquareContent(day)}
                    {count > 0 && <span className={styles.countBadge}>{count}</span>}
                    {isToday(day.date) && count === 0 && <span className={styles.todayDot} />}
                  </motion.button>
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
          </motion.div>
        ) : (
          <motion.div
            key="history-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day detail modal — rendered via portal */}
      {dayDetailModal}
    </div>
  )
}

export default DayGrid
