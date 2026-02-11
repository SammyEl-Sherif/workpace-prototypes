import { Challenge } from '@/interfaces/challenges'
import { Badge, Box, Button, Card, Text } from '@workpace/design-system'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from './ChallengeCard.module.scss'
import { ParticipantsList } from './ParticipantsList'

interface ChallengeCardProps {
  challenge: Challenge
  onUpdate: () => void
}

export const ChallengeCard = ({ challenge, onUpdate }: ChallengeCardProps) => {
  const router = useRouter()
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = new Date(challenge.start_date)
      const end = new Date(challenge.end_date)
      const totalDays = challenge.duration_days
      const daysElapsed = Math.max(
        0,
        Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      )
      const daysLeft = Math.max(
        0,
        Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      )

      setDaysRemaining(daysLeft)
      setProgress(Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100)))
    }

    calculateProgress()
    const interval = setInterval(calculateProgress, 1000 * 60 * 60) // Update hourly
    return () => clearInterval(interval)
  }, [challenge])

  const isActive = daysRemaining > 0
  const isCompleted = daysRemaining === 0 && new Date(challenge.end_date) < new Date()

  const handleViewDetails = () => {
    router.push(`/apps/good-stuff-list/challenges/${challenge.id}`)
  }

  return (
    <Card className={styles.challengeCard}>
      <Box padding={300}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Text variant="headline-sm-emphasis">{challenge.name}</Text>
          </div>
          {isActive && <Badge size="sm">{daysRemaining} days left</Badge>}
          {isCompleted && (
            <Badge variant="success" size="sm">
              Completed
            </Badge>
          )}
        </div>

        {challenge.goal_name && <Box marginY={150}>{challenge.goal_name}</Box>}

        {challenge.description && (
          <Text variant="body-md" color="neutral-600" marginTop={150}>
            {challenge.description}
          </Text>
        )}

        <Box marginTop={200}>
          <Text variant="body-sm-emphasis" marginBottom={100}>
            Daily Task:
          </Text>
          <Text variant="body-sm" color="neutral-700">
            {challenge.task_description}
          </Text>
        </Box>

        {isActive && (
          <Box marginTop={200}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <Text variant="body-xs" color="neutral-600" marginTop={100}>
              {Math.round(progress)}% complete
            </Text>
          </Box>
        )}

        <Box marginTop={200} className={styles.metaInfo}>
          <Text variant="body-xs" color="neutral-600">
            Duration: {challenge.duration_days} days
          </Text>
          {challenge.participant_count !== undefined && (
            <Text variant="body-xs" color="neutral-600">
              {challenge.participant_count} participant
              {challenge.participant_count !== 1 ? 's' : ''}
            </Text>
          )}
        </Box>

        <ParticipantsList challengeId={challenge.id} maxDisplay={3} />

        <div className={styles.actions}>
          <Button variant="default-secondary" onClick={handleViewDetails}>
            View Details
          </Button>
        </div>
      </Box>
    </Card>
  )
}
