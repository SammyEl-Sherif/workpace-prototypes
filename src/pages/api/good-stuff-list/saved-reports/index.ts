import {
  getSavedReportsRoute,
  createSavedReportRoute,
} from '@/apis/routes/saved-reports/saved-reports/saved-reports'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getSavedReportsRoute,
  [HttpMethod.POST]: createSavedReportRoute,
})
