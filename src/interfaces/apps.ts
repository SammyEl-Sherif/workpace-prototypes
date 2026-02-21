import { Routes } from './routes'
import { UserGroup } from './user'

export type App = {
  name: string
  path: string
  description: string
  icon: string
  permittedRoles?: UserGroup[]
  stage: AppStage
  tech: string
}

export const enum AppStage {
  Hidden = 'Hidden',
  WIP = 'WIP',
  MVP = 'MVP',
  Standalone = 'Standalone',
}

/**
 * Helper function to convert kebab-case route to Title Case name
 */
const routeToName = (route: string): string => {
  return route
    .replace('apps/', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Static array of all apps
 */
export const APPS: App[] = [
  {
    name: `📝 ${routeToName(Routes.GOOD_STUFF_LIST)}`,
    path: `/${Routes.GOOD_STUFF_LIST}`,
    description:
      'This app enables you to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on your accomplishments (task tracking in Notion).',
    icon: '📝',
    permittedRoles: [UserGroup.Admin, UserGroup.Default, UserGroup.Vip],
    stage: AppStage.Hidden,
    tech: 'Notion API, OpenAI API',
  },
  {
    name: `📋 Chief of Staff`,
    path: `/${Routes.SMS}`,
    description:
      'Get your morning task summary via SMS. Connect your Notion databases and text "outlook" to receive a summary of all your in-progress tasks.',
    icon: '📋',
    permittedRoles: [UserGroup.Admin],
    stage: AppStage.WIP,
    tech: 'Notion API, SMS, React, TypeScript',
  },
]

/**
 * @deprecated Use APPS array instead
 * Kept for backward compatibility if needed
 */
export const AppMeta = {
  [Routes.GOOD_STUFF_LIST]: {
    description:
      'This app enables you to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on your accomplishments (task tracking in Notion).',
    icon: '📝',
    permittedRoles: [UserGroup.Admin],
    stage: AppStage.WIP,
    tech: 'Notion API, OpenAI API',
  },
  [Routes.SMS]: {
    description:
      'Get your morning task summary via SMS. Connect your Notion databases and text "outlook" to receive a summary of all your in-progress tasks.',
    icon: '📋',
    permittedRoles: [UserGroup.Admin],
    stage: AppStage.WIP,
    tech: 'Notion API, SMS, React, TypeScript',
  },
}
