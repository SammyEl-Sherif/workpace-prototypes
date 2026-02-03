import { useFetch } from '@/hooks'
import { Goal } from '@/interfaces/good-things'

type GoalsResponse = {
  data: { goals: Goal[] }
  status: number
}

export const useGoals = () => {
  const [response, isLoading, error, , makeRequest] = useFetch<GoalsResponse, null>(
    'good-stuff-list/goals',
    { method: 'get', manual: true },
    null
  )

  return {
    goals: (response as GoalsResponse)?.data?.goals ?? [],
    isLoading,
    error,
    refetch: makeRequest,
  }
}
