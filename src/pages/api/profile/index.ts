import { getProfileRoute, updateProfileRoute } from '@/apis/routes/profile'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getProfileRoute,
  [HttpMethod.PATCH]: updateProfileRoute,
})
