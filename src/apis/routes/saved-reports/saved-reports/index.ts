import {
  getSavedReportsRoute,
  createSavedReportRoute,
} from './saved-reports'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getSavedReportsRoute,
  [HttpMethod.POST]: createSavedReportRoute,
})
