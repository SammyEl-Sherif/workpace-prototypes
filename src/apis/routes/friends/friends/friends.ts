import {
  getFriendsController,
  createFriendController,
  deleteFriendController,
  searchUsersController,
} from '@/apis/controllers/friends'

export const getFriendsRoute = getFriendsController
export const createFriendRoute = createFriendController
export const deleteFriendRoute = deleteFriendController
export const searchUsersRoute = searchUsersController
