import { GetServerSideProps } from 'next'

import { ChallengesService } from '@/apis/controllers/challenges/challenges.service'
import { Challenge, ChallengeEvidence } from '@/interfaces/challenges'
import { DocumentTitle } from '@/layout'
import { ChallengeDetailPage } from '@/modules/Challenges'
import { withPageRequestWrapper } from '@/server/utils'

interface ChallengeDetailPageProps {
  challenge?: Challenge | null
  evidence?: ChallengeEvidence[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { req, params } = context
  const challengeId = params?.id as string

  if (!challengeId) {
    return {
      notFound: true,
    }
  }

  // Get user ID from session
  const { getSupabaseSession } = await import('@/server/utils/supabase/getSupabaseSession')
  const { getNextAuthJWT } = await import('@/server/utils/getNextAuthJWT')

  let userId: string | undefined

  // Try NextAuth session first
  const session = await getNextAuthJWT(req)
  if (session) {
    userId = (session as any)?.id || (session as any)?.user?.id
  } else {
    // Fall back to Supabase session
    const supabaseSession = await getSupabaseSession(req as any)
    userId = supabaseSession?.user?.id
  }

  if (!userId) {
    return {
      notFound: true,
    }
  }

  try {
    // Fetch challenge
    const challenge = await ChallengesService.getById(challengeId, userId)
    if (!challenge) {
      return {
        notFound: true,
      }
    }

    // Fetch evidence for this challenge
    let evidence: ChallengeEvidence[] = []
    try {
      evidence = await ChallengesService.getEvidence(challengeId, userId)
    } catch (evidenceError) {
      console.error('Error fetching evidence:', evidenceError)
      // Continue with empty evidence array if fetch fails
      evidence = []
    }

    // Validate challenge has required fields
    if (!challenge.name || !challenge.id) {
      console.error('Challenge missing required fields:', challenge)
      return {
        notFound: true,
      }
    }

    // Serialize challenge dates
    const serializedChallenge: Challenge = {
      ...challenge,
      name: challenge.name || 'Untitled Challenge',
      start_date:
        typeof challenge.start_date === 'string'
          ? challenge.start_date
          : new Date(challenge.start_date as any).toISOString().split('T')[0],
      end_date:
        typeof challenge.end_date === 'string'
          ? challenge.end_date
          : new Date(challenge.end_date as any).toISOString().split('T')[0],
      created_at:
        typeof challenge.created_at === 'string'
          ? challenge.created_at
          : new Date(challenge.created_at as any).toISOString(),
      updated_at:
        typeof challenge.updated_at === 'string'
          ? challenge.updated_at
          : new Date(challenge.updated_at as any).toISOString(),
    }

    // Serialize evidence dates
    const serializedEvidence: ChallengeEvidence[] = evidence.map((e) => ({
      ...e,
      evidence_date:
        typeof e.evidence_date === 'string'
          ? e.evidence_date
          : new Date(e.evidence_date as any).toISOString().split('T')[0],
      created_at:
        typeof e.created_at === 'string'
          ? e.created_at
          : new Date(e.created_at as any).toISOString(),
    }))

    return {
      challenge: serializedChallenge,
      evidence: serializedEvidence,
    }
  } catch (error) {
    console.error('Error fetching challenge:', error)
    return {
      notFound: true,
    }
  }
})

const ChallengeDetailPageComponent = ({ challenge, evidence }: ChallengeDetailPageProps) => {
  // Safety check - should not happen if getServerSideProps works correctly
  if (!challenge || !challenge.name) {
    return (
      <>
        <DocumentTitle title="Challenge Not Found" />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Challenge Not Found</h1>
          <p>
            The challenge you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <DocumentTitle title={`${challenge.name} - Challenges`} />
      <ChallengeDetailPage initialChallenge={challenge} initialEvidence={evidence || []} />
    </>
  )
}

export default ChallengeDetailPageComponent
