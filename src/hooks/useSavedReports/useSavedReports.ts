import { useFetch } from '@/hooks'
import { SavedReport } from '@/interfaces/saved-reports'

type SavedReportsResponse = {
  data: { saved_reports: SavedReport[] }
  status: number
}

export const useSavedReports = () => {
  const [response, isLoading, error, , makeRequest] = useFetch<
    SavedReportsResponse,
    null
  >('good-stuff-list/saved-reports', { method: 'get', manual: true }, null)

  return {
    savedReports: (response as SavedReportsResponse)?.data?.saved_reports ?? [],
    isLoading,
    error,
    refetch: makeRequest,
  }
}
