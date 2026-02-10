import {
  createGoodThingRoute,
  getGoodThingsRoute,
} from '@/apis/routes/good-things/good-things/good-things'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoodThingsRoute,
  [HttpMethod.POST]: createGoodThingRoute,
})
