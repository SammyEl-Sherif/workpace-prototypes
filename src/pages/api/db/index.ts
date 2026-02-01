import { getDbHealthRoute } from '@/apis/routes/db'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getDbHealthRoute,
})
