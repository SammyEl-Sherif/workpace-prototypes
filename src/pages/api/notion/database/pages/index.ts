import { getNotionDatabasePagesRoute } from '@/api/routes/notion'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: getNotionDatabasePagesRoute,
})
