import { useFetch } from '@/hooks'
import { Challenge } from '@/interfaces/challenges'

type ChallengesResponse = {
  data: { challenges: Challenge[] }
  status: number
}

export const useChallenges = () => {
  const [response, isLoading, error, , makeRequest] = useFetch<ChallengesResponse, null>(
    'good-stuff-list/challenges',
    { method: 'get', manual: true },
    null
  )

  return {
    challenges: (response as ChallengesResponse)?.data?.challenges ?? [],
    isLoading,
    error,
    refetch: makeRequest,
  }
}
