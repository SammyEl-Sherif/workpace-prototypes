import { useFetch } from '@/hooks'
import { ProjectsRecord } from '@/pocketbase-types'

export const useProjects = () => {
  const [projects, isLoading, error] = useFetch<ProjectsRecord[], null>(
    'pocketbase/collections/projects',
    {},
    null
  )
  return [projects ?? null, isLoading, error] as const
}
