import { useEffect, useState } from 'react'
import { Box, Text } from '@workpace/design-system'
import { useManualFetch } from '@/hooks'
import { ChallengeParticipant } from '@/interfaces/challenges'
import styles from './ParticipantsList.module.scss'

interface ParticipantsListProps {
  challengeId: string
  maxDisplay?: number
}

export const ParticipantsList = ({ challengeId, maxDisplay = 4 }: ParticipantsListProps) => {
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchParticipants = useManualFetch<{ data: { participants: ChallengeParticipant[] } }>(
    'good-stuff-list/challenges/participants'
  )

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const [result, error] = await fetchParticipants({
          method: 'get',
          url: `good-stuff-list/challenges/participants`,
          params: { challenge_id: challengeId },
        })
        if (!error && result?.data?.participants) {
          setParticipants(result.data.participants)
        }
      } catch (err) {
        console.error('Error fetching participants:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (challengeId) {
      loadParticipants()
    }
  }, [challengeId, fetchParticipants])

  if (isLoading) {
    return null
  }

  if (participants.length === 0) {
    return null
  }

  const displayParticipants = participants.slice(0, maxDisplay)
  const remainingCount = participants.length - maxDisplay

  return (
    <Box marginTop={150}>
      <Text variant="body-sm" color="neutral-600" className={styles.participantsLabel}>
        Participants ({participants.length}):
      </Text>
      <div className={styles.participantsList}>
        {displayParticipants.map((participant) => {
          const displayName = participant.user_name || participant.user_email || 'Unknown'
          return (
            <div key={participant.id} className={styles.participant}>
              <Text variant="body-sm" color="neutral-700">
                {displayName}
              </Text>
            </div>
          )
        })}
        {remainingCount > 0 && (
          <div className={styles.moreBadge}>
            <Text variant="body-sm" color="neutral-600">
              +{remainingCount}
            </Text>
          </div>
        )}
      </div>
    </Box>
  )
}
