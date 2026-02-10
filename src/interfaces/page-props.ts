import { App } from './apps'
import { UserProfile } from './user'

export interface PageProps {
  userProfile: UserProfile
  apps: App[]
}
