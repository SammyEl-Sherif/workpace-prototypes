import { loginUserRoute } from '@/api/routes/pocketbase'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: loginUserRoute,
})
