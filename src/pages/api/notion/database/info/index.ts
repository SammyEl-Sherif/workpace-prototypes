import { getNotionDatabaseInfoRoute } from '@/api/routes/notion'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: getNotionDatabaseInfoRoute,
})

