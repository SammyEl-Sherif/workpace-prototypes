import { dbHealthCheckRoute } from '@/apis/routes/health'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: dbHealthCheckRoute,
})
