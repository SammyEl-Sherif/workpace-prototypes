import { getNotionDatabasesRoute } from '@/apis/routes/notion/database/list'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: getNotionDatabasesRoute,
})
