import { useMemo } from 'react'

import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { useFetch } from '@/hooks'

type UseNotionDatabaseInfoParamProps = {
  database_id: string
}

export const useNotionDatabaseInfo = ({ database_id }: UseNotionDatabaseInfoParamProps) => {
  const data = useMemo(() => {
    return { database_id }
  }, [database_id])

  const [response, isLoading, error, _, makeRequest] = useFetch<
    { data: DatabaseObjectResponse },
    null
  >('notion/database/info', { data }, null)

  return {
    response: response?.data,
    isLoading,
    error,
    makeRequest,
  }
}
