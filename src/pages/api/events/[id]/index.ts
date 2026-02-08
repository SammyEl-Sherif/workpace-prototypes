import { getEventByIdRoute, updateEventRoute, deleteEventRoute } from '@/apis/routes/events'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getEventByIdRoute,
  [HttpMethod.PUT]: updateEventRoute,
  [HttpMethod.PATCH]: updateEventRoute,
  [HttpMethod.DELETE]: deleteEventRoute,
})
