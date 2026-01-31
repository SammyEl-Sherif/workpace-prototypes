import { getNotionDatabaseInfoRoute } from '@/apis/routes/notion'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: getNotionDatabaseInfoRoute,
})
