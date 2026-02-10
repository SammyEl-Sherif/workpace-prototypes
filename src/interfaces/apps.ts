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
    stage: AppStage.WIP,
    tech: 'Notion API, OpenAI API',
  },
  {
    name: `💰 ${routeToName(Routes.BUDGET_BOT)}`,
    path: `/${Routes.BUDGET_BOT}`,
    description:
      'A budgeting tool that helps you understand your financial levers by tracking income, expenses, savings, and calculating what you have left for wants.',
    icon: '💰',
    permittedRoles: [UserGroup.Admin],
    stage: AppStage.WIP,
    tech: 'React, TypeScript',
  },
  {
    name: `💬 ${routeToName(Routes.SMS)}`,
    path: `/${Routes.SMS}`,
    description: 'Send quick SMS notifications to any phone number.',
    icon: '💬',
    permittedRoles: [UserGroup.Admin],
    stage: AppStage.WIP,
    tech: 'React, TypeScript',
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
  [Routes.BUDGET_BOT]: {
    description:
      'A budgeting tool that helps you understand your financial levers by tracking income, expenses, savings, and calculating what you have left for wants.',
    icon: '💰',
    permittedRoles: [UserGroup.Admin],
    stage: AppStage.WIP,
    tech: 'React, TypeScript',
  },
  [Routes.SMS]: {
    description: 'Send quick SMS notifications to any phone number.',
    icon: '💬',
    permittedRoles: [UserGroup.Admin],
    stage: AppStage.WIP,
    tech: 'React, TypeScript',
  },
}
