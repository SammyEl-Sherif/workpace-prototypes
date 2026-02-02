import {
  getGoodThingsRoute,
  createGoodThingRoute,
} from './good-things'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoodThingsRoute,
  [HttpMethod.POST]: createGoodThingRoute,
})
