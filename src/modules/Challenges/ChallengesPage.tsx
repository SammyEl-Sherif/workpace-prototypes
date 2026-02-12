import { useChallengeInvitations, useChallenges } from '@/hooks'
import { Challenge } from '@/interfaces/challenges'
import { AppPageLayout } from '@/layout'
import { Box, Button, Card, Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from './ChallengesPage.module.scss'
import { ChallengeCard } from './components/ChallengeCard'
import { CreateChallengeModal } from './components/CreateChallengeModal'
import { InvitationsList } from './components/InvitationsList'

interface ChallengesPageProps {
  initialChallenges?: Challenge[]
}

export const ChallengesPage = ({ initialChallenges = [] }: ChallengesPageProps) => {
  const router = useRouter()
  const { challenges: fetchedChallenges, isLoading, refetch } = useChallenges()
  const {
    invitations,
    isLoading: isLoadingInvitations,
    refetch: refetchInvitations,
  } = useChallengeInvitations()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showInvitations, setShowInvitations] = useState(false)

  // Use initial data from server-side props if available, otherwise fall back to client fetch
  const challenges = initialChallenges.length > 0 ? initialChallenges : fetchedChallenges

  useEffect(() => {
    refetch()
    refetchInvitations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter active challenges (not ended yet)
  const activeChallenges = challenges.filter((challenge) => {
    const endDate = new Date(challenge.end_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return endDate >= today
  })

  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending')

  return (
    <AppPageLayout
      breadcrumbs={[
        { label: 'Apps', href: '/apps' },
        { label: 'Good Stuff List', href: '/apps/good-stuff-list' },
        { label: 'Challenges' },
      ]}
      titleContent={
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={styles.floatingHeader}
        >
          <div className={styles.headerContent}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={styles.titleSection}
            >
              <h1 className={styles.mainTitle}>🏆 Challenges</h1>
              <p className={styles.subtitle}>
                Create and join challenges with friends to stay accountable and achieve your goals
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={styles.actionsSection}
            >
              {pendingInvitations.length > 0 && (
                <Button
                  variant="default-secondary"
                  onClick={() => setShowInvitations(!showInvitations)}
                  style={{ marginRight: '12px' }}
                >
                  Invitations ({pendingInvitations.length})
                </Button>
              )}
              <Button variant="brand-primary" onClick={() => setIsCreateModalOpen(true)}>
                Create Challenge
              </Button>
            </motion.div>
          </div>
        </motion.div>
      }
    >
      {showInvitations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.invitationsSection}
        >
          <InvitationsList
            invitations={pendingInvitations}
            onAccept={() => {
              refetch()
              refetchInvitations()
            }}
            onDecline={() => {
              refetchInvitations()
            }}
          />
        </motion.div>
      )}

      <div className={styles.challengesGrid}>
        {isLoading ? (
          <Text>Loading challenges...</Text>
        ) : activeChallenges.length === 0 ? (
          <Card>
            <Box padding={300}>
              <Box marginBottom={150}>
                <Text variant="headline-md">No active challenges</Text>
              </Box>
              <Text variant="body-md" color="neutral-600">
                Create your first challenge to get started!
              </Text>
            </Box>
          </Card>
        ) : (
          activeChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} onUpdate={() => refetch()} />
          ))
        )}
      </div>

      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch()
          setIsCreateModalOpen(false)
        }}
      />
    </AppPageLayout>
  )
}
