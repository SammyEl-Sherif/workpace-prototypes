import { generateReportRoute } from '@/api/routes/openai'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: generateReportRoute,
})

