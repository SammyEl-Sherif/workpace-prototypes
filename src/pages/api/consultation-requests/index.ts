import { createConsultationRequestController } from '@/apis/controllers/consultation-requests'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export default apiRequestWrapper({
  [HttpMethod.POST]: createConsultationRequestController,
})
