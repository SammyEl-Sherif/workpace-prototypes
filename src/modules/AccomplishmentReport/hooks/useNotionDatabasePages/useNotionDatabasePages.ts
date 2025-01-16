import { useMemo } from 'react'

import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'

import { useFetch } from '@/hooks'
import { PageSummary } from '@/interfaces/notion'
import { HttpError } from '@/models'

type UseNotionDatabaseInfoParamProps = {
  database_id: string
  filters: QueryDatabaseParameters['filter']
}
type UseNotionDatabaseInfoReturnProps = {
  pages: PageSummary[]
  isLoading: boolean
  error: HttpError | Error | null
}

export const useNotionDatabasePages = ({
  database_id,
  filters,
}: UseNotionDatabaseInfoParamProps): UseNotionDatabaseInfoReturnProps => {
  const data = useMemo(() => {
    return {
      database_id,
      filters,
    }
  }, [database_id])

  const [response, isLoading, error] = useFetch<{ data: PageSummary[] }, null>(
    'notion/database/pages',
    { data },
    null
  )
  console.log('response?.data', response?.data)
  console.log('filters', filters)
  return {
    pages: response?.data ?? [],
    isLoading,
    error,
  }
}
