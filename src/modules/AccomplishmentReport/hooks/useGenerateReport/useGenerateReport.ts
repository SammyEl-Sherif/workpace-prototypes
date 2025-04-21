import { useMemo } from 'react'

import { useFetch } from '@/hooks'
import { PageSummary } from '@/interfaces/notion'
import { GenerateReportDTO } from '@/interfaces/openai'
import { DefaultPrompts } from '@/interfaces/prompts'

type UseGenerateReportParamProps = {
  pages: PageSummary[]
  userPrompt?: string | null
}

export const useGenerateReport = ({ pages, userPrompt }: UseGenerateReportParamProps) => {
  const data = useMemo(() => {
    return { pages, userPrompt: userPrompt ?? DefaultPrompts.yearEndReview }
  }, [pages, userPrompt])
  console.log('accomplishmentUsegenerate', data)

  const [response, isLoading, error, , makeRequest] = useFetch<GenerateReportDTO, null>(
    'openai/generateReport',
    { data, manual: true },
    null
  )

  return [response?.response ?? '', isLoading, error, makeRequest] as const
}
