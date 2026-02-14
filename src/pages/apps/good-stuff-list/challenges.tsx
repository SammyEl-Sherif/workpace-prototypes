import { GetServerSideProps } from 'next'

import { ChallengesService } from '@/apis/controllers/challenges/challenges.service'
import { Challenge } from '@/interfaces/challenges'
import { DocumentTitle } from '@/layout'
import { ChallengesPage } from '@/modules/Challenges'
import { withPageRequestWrapper } from '@/server/utils'

interface ChallengesPageProps {
  challenges: Challenge[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { req } = context

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
      challenges: [],
    }
  }

  // Fetch all challenges
  let challenges: Challenge[] = []
  try {
    challenges = await ChallengesService.getAll(userId)
  } catch (error) {
    console.error('Error fetching challenges:', error)
    // Return empty array if there's an error (e.g., tables don't exist yet)
    challenges = []
  }

  // Serialize challenges to ensure Date objects are converted to strings
  const serializedChallenges: Challenge[] = challenges.map((c) => ({
    ...c,
    start_date:
      typeof c.start_date === 'string'
        ? c.start_date
        : new Date(c.start_date as any).toISOString().split('T')[0],
    end_date:
      typeof c.end_date === 'string'
        ? c.end_date
        : new Date(c.end_date as any).toISOString().split('T')[0],
    created_at:
      typeof c.created_at === 'string' ? c.created_at : new Date(c.created_at as any).toISOString(),
    updated_at:
      typeof c.updated_at === 'string' ? c.updated_at : new Date(c.updated_at as any).toISOString(),
  }))

  return {
    challenges: serializedChallenges,
  }
})

const ChallengesPageComponent = ({ challenges }: ChallengesPageProps) => {
  return (
    <>
      <DocumentTitle title="Challenges - Good Stuff List" />
      <ChallengesPage initialChallenges={challenges} />
    </>
  )
}

export default ChallengesPageComponent
