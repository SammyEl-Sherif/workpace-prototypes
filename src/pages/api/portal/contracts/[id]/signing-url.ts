import { getSigningUrlRoute } from '@/apis/routes/portal'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getSigningUrlRoute,
})
