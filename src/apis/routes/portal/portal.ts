import {
  getPortalUserController,
  portalSignupController,
  getPendingPortalUsersController,
  approvePortalUserController,
  deactivatePortalUserController,
} from '@/apis/controllers/portal'

export const getPortalUserRoute = getPortalUserController
export const portalSignupRoute = portalSignupController
export const getPendingPortalUsersRoute = getPendingPortalUsersController
export const approvePortalUserRoute = approvePortalUserController
export const deactivatePortalUserRoute = deactivatePortalUserController
