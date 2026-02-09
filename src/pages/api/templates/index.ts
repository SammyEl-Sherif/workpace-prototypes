import { getTemplatesRoute } from '@/apis/routes/templates'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getTemplatesRoute,
})
