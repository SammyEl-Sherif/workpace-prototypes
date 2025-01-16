import { useMemo } from 'react'

import { useFetch } from '@/hooks'
import { PageSummary } from '@/interfaces/notion'
import { GenerateReportDTO } from '@/interfaces/openai'
import { DefaultPrompts } from '@/interfaces/prompts'
import { HttpError } from '@/models'

type UseGenerateReportParamProps = {
  pages: PageSummary[]
  userPrompt?: string | null
}
type UseGenerateReportReturnProps = {
  response: string
  isLoading: boolean
  error: HttpError | Error | null
  makeRequest: () => void
}

export const useGenerateReport = ({
  pages,
  userPrompt,
}: UseGenerateReportParamProps): UseGenerateReportReturnProps => {
  const data = useMemo(() => {
    return { pages, userPrompt: userPrompt ?? DefaultPrompts.yearEndReview }
  }, [pages, userPrompt])

  const [response, isLoading, error, _, makeRequest] = useFetch<GenerateReportDTO, null>(
    'openai/generateReport',
    { data, manual: true },
    null
  )

  return {
    response: (response?.data.response as string) ?? '',
    isLoading,
    error,
    makeRequest,
  }
}
