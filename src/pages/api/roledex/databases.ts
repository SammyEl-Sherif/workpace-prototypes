import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import {
  addRoledexDatabaseRoute,
  getRoledexDatabasesRoute,
  removeRoledexDatabaseRoute,
} from '@/apis/routes/roledex/databases/databases'

export default apiRequestWrapper({
  [HttpMethod.GET]: getRoledexDatabasesRoute,
  [HttpMethod.POST]: addRoledexDatabaseRoute,
  [HttpMethod.DELETE]: removeRoledexDatabaseRoute,
})
