import {
  getGoodThingByIdRoute,
  updateGoodThingRoute,
  deleteGoodThingRoute,
} from './good-things'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoodThingByIdRoute,
  [HttpMethod.PUT]: updateGoodThingRoute,
  [HttpMethod.PATCH]: updateGoodThingRoute,
  [HttpMethod.DELETE]: deleteGoodThingRoute,
})
