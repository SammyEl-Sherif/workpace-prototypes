import {
  getSavedReportByIdRoute,
  updateSavedReportRoute,
  deleteSavedReportRoute,
} from '@/apis/routes/saved-reports/saved-reports/saved-reports'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getSavedReportByIdRoute,
  [HttpMethod.PUT]: updateSavedReportRoute,
  [HttpMethod.PATCH]: updateSavedReportRoute,
  [HttpMethod.DELETE]: deleteSavedReportRoute,
})
