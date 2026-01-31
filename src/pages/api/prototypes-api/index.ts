import { getPrototypesRoute } from '@/apis/routes/prototypes'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getPrototypesRoute,
})
