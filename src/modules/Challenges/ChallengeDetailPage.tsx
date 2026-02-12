import { useChallenges, useManualFetch } from '@/hooks'
import { Challenge, ChallengeEvidence } from '@/interfaces/challenges'
import { AppPageLayout } from '@/layout'
import { Badge, Box, Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import styles from './ChallengeDetailPage.module.scss'
import { ChallengeDayGrid } from './components/ChallengeDayGrid'
import { EvidenceModal } from './components/EvidenceModal'
import { ParticipantsList } from './components/ParticipantsList'

interface ChallengeDetailPageProps {
  initialChallenge: Challenge
  initialEvidence: ChallengeEvidence[]
}

export const ChallengeDetailPage = ({
  initialChallenge,
  initialEvidence,
}: ChallengeDetailPageProps) => {
  const router = useRouter()
  const { challenges, refetch } = useChallenges()
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [evidence, setEvidence] = useState<ChallengeEvidence[]>(initialEvidence)
  const fetchEvidence = useManualFetch<{ data: { evidence: ChallengeEvidence[] } }>(
    `good-stuff-list/challenges/evidence`
  )

  // Find challenge in fetched list or use initial
  const challenge = challenges.find((c) => c.id === initialChallenge.id) || initialChallenge

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDayClick = (dateKey: string) => {
    setSelectedDay(dateKey)
  }

  const handleCloseModal = () => {
    setSelectedDay(null)
  }

  const handleEvidenceUpdate = async () => {
    // Refetch evidence when new evidence is uploaded (all participants)
    try {
      const [result, error] = await fetchEvidence({
        method: 'get',
        url: `good-stuff-list/challenges/evidence`,
        params: { challenge_id: challenge.id },
        // Don't pass user_id to get all participants' evidence
      })
      if (!error && result?.data?.evidence) {
        setEvidence(result.data.evidence)
      }
    } catch (err) {
      console.error('Error refetching evidence:', err)
    }
  }

  // Calculate days remaining
  const daysRemaining = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const end = new Date(challenge.end_date)
    return Math.max(0, Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  }, [challenge.end_date])

  const isActive = daysRemaining > 0
  const isCompleted = daysRemaining === 0 && new Date(challenge.end_date) < new Date()

  // Get evidence for selected day
  const selectedDayEvidence = selectedDay
    ? evidence.filter((e) => e.evidence_date === selectedDay)
    : []

  return (
    <AppPageLayout
      breadcrumbs={[
        { label: 'Apps', href: '/apps' },
        { label: 'Good Stuff List', href: '/apps/good-stuff-list' },
        { label: 'Challenges', href: '/apps/good-stuff-list/challenges' },
        { label: challenge.name },
      ]}
      titleContent={
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={styles.header}
        >
          <div className={styles.headerContent}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={styles.titleSection}
            >
              <h1 className={styles.mainTitle}>{challenge.name}</h1>
              {challenge.goal_name && (
                <Box marginY={150}>
                  <Text variant="body-md" color="neutral-600">
                    {challenge.goal_name}
                  </Text>
                </Box>
              )}
              {challenge.description && (
                <Text variant="body-md" color="neutral-600" marginTop={100}>
                  {challenge.description}
                </Text>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={styles.statusSection}
            >
              {isActive && (
                <Badge size="sm" variant="info">
                  {daysRemaining} days left
                </Badge>
              )}
              {isCompleted && (
                <Badge size="sm" variant="success">
                  Completed
                </Badge>
              )}
            </motion.div>
          </div>
        </motion.div>
      }
    >
      <div className={styles.container}>
        <Box marginTop={300} marginBottom={200}>
          <Text variant="body-sm-emphasis" marginBottom={150}>
            Daily Task:
          </Text>
          <Text variant="body-sm" color="neutral-700">
            {challenge.task_description}
          </Text>
        </Box>

        <Box marginBottom={200}>
          <ParticipantsList challengeId={challenge.id} />
        </Box>

        <ChallengeDayGrid
          challenge={challenge}
          evidence={evidence}
          onDayClick={handleDayClick}
          onEvidenceUpdate={handleEvidenceUpdate}
        />
      </div>

      {selectedDay && (
        <EvidenceModal
          isOpen={!!selectedDay}
          onClose={handleCloseModal}
          challenge={challenge}
          evidenceDate={selectedDay}
          evidence={selectedDayEvidence}
          onEvidenceUpdate={handleEvidenceUpdate}
        />
      )}
    </AppPageLayout>
  )
}
