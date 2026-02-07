import { getGoodThingsByDateRangeController } from '@/apis/controllers'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.GET]: getGoodThingsByDateRangeController,
})
