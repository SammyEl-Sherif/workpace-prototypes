import { addEventGuestsRoute } from '@/apis/routes/events'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: addEventGuestsRoute,
})
