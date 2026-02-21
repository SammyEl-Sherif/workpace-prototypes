import {
  getPortalUserController,
  portalSignupController,
  getPendingPortalUsersController,
  approvePortalUserController,
  deactivatePortalUserController,
  getPendingSubmissionController,
  getIntakeController,
  saveIntakeDraftController,
  submitIntakeController,
  getAllIntakesController,
  reviewIntakeController,
  sendContractForIntakeController,
  getChangeRequestsController,
  getChangeRequestController,
  createChangeRequestController,
  getContractsController,
  getContractController,
  createContractController,
  sendContractController,
  getSigningUrlController,
} from '@/apis/controllers/portal'

export const getPortalUserRoute = getPortalUserController
export const portalSignupRoute = portalSignupController
export const getPendingSubmissionRoute = getPendingSubmissionController
export const getPendingPortalUsersRoute = getPendingPortalUsersController
export const approvePortalUserRoute = approvePortalUserController
export const deactivatePortalUserRoute = deactivatePortalUserController
export const getIntakeRoute = getIntakeController
export const saveIntakeDraftRoute = saveIntakeDraftController
export const submitIntakeRoute = submitIntakeController
export const getChangeRequestsRoute = getChangeRequestsController
export const getChangeRequestRoute = getChangeRequestController
export const createChangeRequestRoute = createChangeRequestController
export const getContractsRoute = getContractsController
export const getContractRoute = getContractController
export const createContractRoute = createContractController
export const sendContractRoute = sendContractController
export const getSigningUrlRoute = getSigningUrlController
export const getAllIntakesRoute = getAllIntakesController
export const reviewIntakeRoute = reviewIntakeController
export const sendContractForIntakeRoute = sendContractForIntakeController
