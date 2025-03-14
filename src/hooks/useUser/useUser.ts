import { useUserInfoContext } from '@/contexts/UserInfoContextProvider'

export const useUser = () => {
  const userInfo = useUserInfoContext()
  return {
    user: userInfo.userProfile,
  }
}
