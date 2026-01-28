import { useMemo } from 'react'

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { useFetch } from '@/hooks'

type UseNotionDatabaseInfoParamProps = {
  database_id: string
}

export const useNotionDatabaseInfo = ({ database_id }: UseNotionDatabaseInfoParamProps) => {
  const data = useMemo(() => {
    return { action: 'info', database_id }
  }, [database_id])

  const [response, isLoading, error, _, makeRequest] = useFetch<DatabaseObjectResponse, null>(
    'notion/database',
    { data },
    null
  )

  return {
    response,
    isLoading,
    error,
    makeRequest,
  }
}
