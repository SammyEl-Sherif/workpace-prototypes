import { getNotionAccomplishmentsRoute } from '@/api/routes/notion/accomplishments/accomplishments'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getNotionAccomplishmentsRoute,
})
