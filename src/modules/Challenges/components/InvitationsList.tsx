import { useManualFetch } from '@/hooks'
import { ChallengeInvitation } from '@/interfaces/challenges'
import { Box, Button, Card, Text } from '@workpace/design-system'
import styles from './InvitationsList.module.scss'

interface InvitationsListProps {
  invitations: ChallengeInvitation[]
  onAccept: () => void
  onDecline: () => void
}

export const InvitationsList = ({ invitations, onAccept, onDecline }: InvitationsListProps) => {
  const updateInvitation = useManualFetch<{ data: { invitation: any } }>('')

  const handleAccept = async (invitationId: string) => {
    const [result, error] = await updateInvitation({
      method: 'patch',
      url: `good-stuff-list/challenges/invitations/${invitationId}`,
      data: { status: 'accepted' },
    })

    if (!error) {
      onAccept()
    }
  }

  const handleDecline = async (invitationId: string) => {
    const [result, error] = await updateInvitation({
      method: 'patch',
      url: `good-stuff-list/challenges/invitations/${invitationId}`,
      data: { status: 'declined' },
    })

    if (!error) {
      onDecline()
    }
  }

  if (invitations.length === 0) {
    return null
  }

  return (
    <Card>
      <Box padding={300}>
        <Text variant="headline-md-emphasis" marginBottom={200}>
          Pending Invitations
        </Text>
        <div className={styles.invitationsList}>
          {invitations.map((invitation) => (
            <div key={invitation.id} className={styles.invitationItem}>
              <div className={styles.invitationInfo}>
                <Text variant="body-md-emphasis">{invitation.challenge_name || 'Challenge'}</Text>
                <Text variant="body-sm" color="neutral-600">
                  Invited by: {invitation.inviter_name || invitation.inviter_user_id}
                </Text>
              </div>
              <div className={styles.invitationActions}>
                <Button variant="brand-primary" onClick={() => handleAccept(invitation.id)}>
                  Accept
                </Button>
                <Button variant="default-secondary" onClick={() => handleDecline(invitation.id)}>
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Box>
    </Card>
  )
}
