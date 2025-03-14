import { FC, createContext, useContext, useMemo, useState } from 'react'

import { UserGroup } from '@/interfaces/user'

type UserProfile = {
  name: string
  email: string
  roles: UserGroup[]
}

type UserInfoContextProps = {
  userProfile?: UserProfile
  updateUserInfo?: (newProfile: UserProfile) => void
  children?: React.ReactNode
}

type UserInfoContextState = UserInfoContextProps

const UserInfoContext = createContext<UserInfoContextState | undefined>(undefined)

export const UserInfoContextProvider: FC<UserInfoContextProps> = ({ userProfile, children }) => {
  const [profile, setProfile] = useState<UserInfoContextProps['userProfile']>(userProfile)
  const updateUserInfo = (newProfile: UserProfile) => {
    if (newProfile) {
      setProfile(newProfile)
    }
  }

  const contextValue = useMemo(() => ({ userProfile: profile, updateUserInfo }), [profile])

  return <UserInfoContext.Provider value={contextValue}>{children}</UserInfoContext.Provider>
}

export const useUserInfoContext = (): UserInfoContextState => {
  const state = useContext(UserInfoContext)

  if (typeof state === 'undefined') {
    throw new Error('useUserInfoContext must be used within a UserInfoContextProvider')
  }

  return state
}
