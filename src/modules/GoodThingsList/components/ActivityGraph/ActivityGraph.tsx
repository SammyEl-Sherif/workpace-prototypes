import { useMemo } from 'react'

import { GoodThing } from '@/interfaces/good-things'

import styles from './ActivityGraph.module.scss'

interface ActivityGraphProps {
  goodThings: GoodThing[]
}

// GitHub-style color levels (0-4 contributions)
const getColorLevel = (count: number): number => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count >= 2 && count <= 3) return 2
  if (count >= 4 && count <= 5) return 3
  return 4 // 6+ contributions
}

const ActivityGraph = ({ goodThings }: ActivityGraphProps) => {
  // Generate the last 52 weeks of data (GitHub shows 1 year)
  // GitHub's graph shows weeks from Sunday to Saturday, going back 52 weeks
  const weeks = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weeksData: Date[][] = []

    // Calculate the start date (52 weeks ago, aligned to Sunday)
    const todayDay = today.getDay() // 0 = Sunday, 6 = Saturday
    const daysSinceSunday = todayDay

    // Start from 52 weeks ago, aligned to the Sunday of that week
    for (let week = 51; week >= 0; week--) {
      const weekDays: Date[] = []

      // Calculate the Sunday of this week
      const daysAgo = week * 7 + daysSinceSunday
      const weekSunday = new Date(today)
      weekSunday.setDate(today.getDate() - daysAgo)
      weekSunday.setHours(0, 0, 0, 0)

      // Add all 7 days of the week (Sunday to Saturday)
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekSunday)
        date.setDate(weekSunday.getDate() + day)
        weekDays.push(date)
      }

      weeksData.push(weekDays)
    }

    return weeksData
  }, [])

  // Count accomplishments per day
  const dayCounts = useMemo(() => {
    const counts = new Map<string, number>()

    goodThings.forEach((goodThing) => {
      if (goodThing.created_at) {
        const date = new Date(goodThing.created_at)
        const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
        counts.set(dateKey, (counts.get(dateKey) || 0) + 1)
      }
    })

    return counts
  }, [goodThings])

  // Get count for a specific date
  const getDayCount = (date: Date): number => {
    const dateKey = date.toISOString().split('T')[0]
    return dayCounts.get(dateKey) || 0
  }

  // Get color class based on contribution count
  const getColorClass = (count: number): string => {
    const level = getColorLevel(count)
    return styles[`level${level}`]
  }

  // Get tooltip text
  const getTooltip = (date: Date, count: number): string => {
    if (count === 0) {
      return `No accomplishments on ${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`
    }
    const plural = count === 1 ? 'accomplishment' : 'accomplishments'
    return `${count} ${plural} on ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`
  }

  // Day labels for the left side
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={styles.container}>
      <div className={styles.graph}>
        <div className={styles.labels}>
          {dayLabels.map((label, index) => (
            <div key={label} className={styles.dayLabel} style={{ gridRow: index + 1 }}>
              {index % 2 === 0 ? label : ''}
            </div>
          ))}
        </div>
        <div className={styles.grid}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={styles.week}>
              {week.map((date, dayIndex) => {
                const count = getDayCount(date)
                const isToday = date.toDateString() === new Date().toDateString()
                const isFuture = date > new Date()

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`${styles.day} ${getColorClass(count)} ${
                      isToday ? styles.today : ''
                    } ${isFuture ? styles.future : ''}`}
                    title={getTooltip(date, count)}
                    data-count={count}
                  />
                )
              })}
            </div>
          ))}
        </div>
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

export default ActivityGraph
