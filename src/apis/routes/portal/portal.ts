import {
  getPortalUserController,
  portalSignupController,
  getPendingPortalUsersController,
  approvePortalUserController,
  deactivatePortalUserController,
  getIntakeController,
  saveIntakeDraftController,
  submitIntakeController,
  getChangeRequestsController,
  getChangeRequestController,
  createChangeRequestController,
} from '@/apis/controllers/portal'

export const getPortalUserRoute = getPortalUserController
export const portalSignupRoute = portalSignupController
export const getPendingPortalUsersRoute = getPendingPortalUsersController
export const approvePortalUserRoute = approvePortalUserController
export const deactivatePortalUserRoute = deactivatePortalUserController
export const getIntakeRoute = getIntakeController
export const saveIntakeDraftRoute = saveIntakeDraftController
export const submitIntakeRoute = submitIntakeController
export const getChangeRequestsRoute = getChangeRequestsController
export const getChangeRequestRoute = getChangeRequestController
export const createChangeRequestRoute = createChangeRequestController
