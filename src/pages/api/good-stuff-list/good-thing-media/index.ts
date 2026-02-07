import { createMediaRoute } from '@/apis/routes/good-things/good-thing-media/good-thing-media'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: createMediaRoute,
})
