import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'
import {
  addChiefOfStaffDatabaseRoute,
  getChiefOfStaffDatabasesRoute,
  removeChiefOfStaffDatabaseRoute,
} from '@/apis/routes/chief-of-staff/databases/databases'

export default apiRequestWrapper({
  [HttpMethod.GET]: getChiefOfStaffDatabasesRoute,
  [HttpMethod.POST]: addChiefOfStaffDatabaseRoute,
  [HttpMethod.DELETE]: removeChiefOfStaffDatabaseRoute,
})
