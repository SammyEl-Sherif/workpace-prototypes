import {
  deleteGoodThingRoute,
  getGoodThingByIdRoute,
  updateGoodThingRoute,
} from '@/apis/routes/good-things/good-things/good-things'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoodThingByIdRoute,
  [HttpMethod.PUT]: updateGoodThingRoute,
  [HttpMethod.PATCH]: updateGoodThingRoute,
  [HttpMethod.DELETE]: deleteGoodThingRoute,
})
