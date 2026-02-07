import {
  getMediaByGoodThingRoute,
  deleteMediaRoute,
} from '@/apis/routes/good-things/good-thing-media/good-thing-media'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getMediaByGoodThingRoute,
  [HttpMethod.DELETE]: deleteMediaRoute,
})
