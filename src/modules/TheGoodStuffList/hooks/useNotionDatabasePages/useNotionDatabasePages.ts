import { useMemo } from 'react'

import { useFetch } from '@/hooks'
import { PageSummary } from '@/interfaces/notion'
import { HttpError } from '@/models'
import { useNotionDatabaseContext } from '../../contexts'

type UseNotionDatabaseInfoReturnProps = {
  pages: PageSummary[]
  isLoading: boolean
  error: HttpError | Error | null
}

export const useNotionDatabasePages = (): UseNotionDatabaseInfoReturnProps => {
  const {
    state: { database_id, filters },
  } = useNotionDatabaseContext()
  const data = useMemo(() => {
    return {
      database_id,
      filters: filters ?? {
        property: 'Status',
        status: {
          equals: 'Accomplishment',
        },
      },
    }
  }, [database_id, JSON.stringify(filters)])

  const [response, isLoading, error] = useFetch<PageSummary[], null>(
    'notion/database/pages',
    { data },
    null
  )

  return {
    pages: (response as PageSummary[]) ?? [],
    isLoading,
    error,
  }
}
