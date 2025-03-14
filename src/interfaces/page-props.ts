import { UserGroup } from './user'

export interface PageProps {
  userProfile: {
    name: string
    email: string
    roles: UserGroup[]
  }
}
