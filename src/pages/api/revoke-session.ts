import { revokeSession } from '@/apis/routes/auth'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper(revokeSession)
