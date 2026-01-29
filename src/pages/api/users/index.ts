import { createUserRoute } from '@/apis/routes/users'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: createUserRoute,
})
