import { useFetch } from '@/hooks'
import { RecordModel } from 'pocketbase'

export const useProjects = () => {
  const [response, isLoading, error] = useFetch<{ data: RecordModel[] }, null>(
    'pocketbase/collections/projects',
    {},
    null
  )
  return {
    response: response?.data ?? ([] as RecordModel[]),
    isLoading,
    error,
  }
}
