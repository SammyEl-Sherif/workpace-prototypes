import { useMemo } from 'react'

import { useFetch } from '@/hooks'
import { GoodThing } from '@/interfaces/good-things'
import { GenerateReportDTO } from '@/interfaces/openai'
import { DefaultPrompts } from '@/interfaces/prompts'

type UseGenerateReportFromGoodThingsParamProps = {
  goodThings: GoodThing[]
  userPrompt?: string | null
}

// Convert GoodThing to PageSummary format for compatibility with existing report generation
const convertGoodThingToPageSummary = (goodThing: GoodThing) => {
  return {
    title: goodThing.title,
    summary: goodThing.description || null,
    completionDate: goodThing.completion_date || null,
    accomplishmentType: goodThing.goal_name || null,
  }
}

export const useGenerateReportFromGoodThings = ({
  goodThings,
  userPrompt,
}: UseGenerateReportFromGoodThingsParamProps) => {
  const data = useMemo(() => {
    const pages = goodThings.map(convertGoodThingToPageSummary)
    return { pages, userPrompt: userPrompt ?? DefaultPrompts.yearEndReview }
  }, [goodThings, userPrompt])

  const [response, isLoading, error, , makeRequest] = useFetch<GenerateReportDTO, null>(
    'openai/generateReport',
    { data, manual: true },
    null
  )

  return [response?.response ?? '', isLoading, error, makeRequest] as const
}
