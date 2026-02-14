import { Challenge, ChallengeEvidence } from '@/interfaces/challenges'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
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

  const handleSquareClick = (day: ChallengeDayData) => {
    if (!day.isFuture) {
      onDayClick(day.dateKey)
    }
  }

  // Use same grid layout as DayGrid: 8 columns on desktop, 4 on mobile
  // CSS handles the responsive breakpoint, so we always use 8 here
  const gridColumns = 8

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {days.map((day, index) => {
          const count = day.evidence.length
          const level = getColorLevel(count)
          const hasEvidence = count > 0

          return (
            <motion.div
              key={day.dateKey}
              className={`${styles.square} ${styles[`level${level}`]} ${
                day.isToday ? styles.today : ''
              } ${day.isPast ? styles.past : ''} ${day.isFuture ? styles.future : ''} ${
                hasEvidence ? styles.hasEvidence : ''
              } ${!day.isFuture ? styles.clickable : ''}`}
              onClick={() => handleSquareClick(day)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.2,
                delay: index * 0.015,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={!day.isFuture ? { scale: 1.06 } : {}}
              whileTap={!day.isFuture ? { scale: 0.97 } : {}}
              title={`Day ${day.dayNumber} - ${formatDate(day.date)} - ${count} achievement${
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
