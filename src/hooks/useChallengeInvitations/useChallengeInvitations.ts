import { useFetch } from '@/hooks'
import { ChallengeInvitation } from '@/interfaces/challenges'

type ChallengeInvitationsResponse = {
  data: { invitations: ChallengeInvitation[] }
  status: number
}

export const useChallengeInvitations = () => {
  const [response, isLoading, error, , makeRequest] = useFetch<ChallengeInvitationsResponse, null>(
    'good-stuff-list/challenges/invitations',
    { method: 'get', manual: true },
    null
  )

  return {
    invitations: (response as ChallengeInvitationsResponse)?.data?.invitations ?? [],
    isLoading,
    error,
    refetch: makeRequest,
  }
}
