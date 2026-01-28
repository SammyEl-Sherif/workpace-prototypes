import { revokeSession } from '@/api/routes/auth'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper(revokeSession)

