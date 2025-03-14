import { Routes } from './routes'
import { UserGroup } from './user'

export type Prototype = {
  name: string
  path: string
  description: string
  icon: any
  permittedRoles?: UserGroup[]
}

export const PrototypeMeta = {
  [Routes.GOOD_STUFF_LIST]: {
    description:
      'This prototype enables me to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on my accomplishments (task tracking in Notion).',
    icon: '📝',
    permittedRoles: [UserGroup.Admin],
  },
}
