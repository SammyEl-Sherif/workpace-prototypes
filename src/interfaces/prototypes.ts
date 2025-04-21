import { Routes } from './routes'
import { UserGroup } from './user'

export type Prototype = {
  name: string
  path: string
  description: string
  icon: any
  permittedRoles?: UserGroup[]
  stage: PrototypeStage
}

export const enum PrototypeStage {
  WIP = 'WIP',
  MVP = 'MVP',
  Standalone = 'Standalone',
}

export const PrototypeMeta = {
  [Routes.GOOD_STUFF_LIST]: {
    description:
      'This prototype enables me to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on my accomplishments (task tracking in Notion).',
    icon: '📝',
    permittedRoles: [UserGroup.Admin],
    stage: PrototypeStage.WIP,
  },
}
