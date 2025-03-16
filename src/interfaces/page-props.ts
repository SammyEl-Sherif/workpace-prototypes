import { Prototype } from './prototypes'
import { UserProfile } from './user'

export interface PageProps {
  userProfile: UserProfile
  prototypes: Prototype[]
}
