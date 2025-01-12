import { useManualFetch } from '@/hooks'
import { useEvent } from '@/hooks/useEvent/useEvent'
import { PageSummary } from '@/interfaces/notion'
import { GenerateReportDTO } from '@/interfaces/openai'

type UseGenerateReportProps = {
  accomplishments: PageSummary[]
}

export const useGenerateReport = ({ accomplishments }: UseGenerateReportProps) => {
  const generateReport = useManualFetch<GenerateReportDTO>('openai/generateReport', {
    method: 'get',
  })
  return useEvent(async ({ ...props }: { data: PageSummary[] }) => {
    const { data } = props
    return generateReport({
      data: { data },
    })
  })
}
