import { Routes } from './routes'
import { UserGroup } from './user'

export type Prototype = {
  name: string
  path: string
  description: string
  icon: string
  permittedRoles?: UserGroup[]
  stage: PrototypeStage
  tech: string
}

export const enum PrototypeStage {
  WIP = 'WIP',
  MVP = 'MVP',
  Standalone = 'Standalone',
}

/**
 * Helper function to convert kebab-case route to Title Case name
 */
const routeToName = (route: string): string => {
  return route
    .replace('prototypes/', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Static array of all prototypes
 * This replaces the dynamic file system approach
 */
export const PROTOTYPES: Prototype[] = [
  {
    name: `📝 ${routeToName(Routes.GOOD_STUFF_LIST)}`,
    path: `/${Routes.GOOD_STUFF_LIST}`,
    description:
      'This prototype enables me to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on my accomplishments (task tracking in Notion).',
    icon: '📝',
    permittedRoles: [UserGroup.Admin],
    stage: PrototypeStage.WIP,
    tech: 'Notion API, OpenAI API',
  },
  {
    name: `💰 ${routeToName(Routes.BUDGET_BOT)}`,
    path: `/${Routes.BUDGET_BOT}`,
    description:
      'A budgeting tool that helps you understand your financial levers by tracking income, expenses, savings, and calculating what you have left for wants.',
    icon: '💰',
    permittedRoles: [UserGroup.Admin],
    stage: PrototypeStage.WIP,
    tech: 'React, TypeScript',
  },
  {
    name: `💬 ${routeToName(Routes.SMS)}`,
    path: `/${Routes.SMS}`,
    description: 'Send quick SMS notifications to any phone number.',
    icon: '💬',
    permittedRoles: [UserGroup.Admin],
    stage: PrototypeStage.WIP,
    tech: 'React, TypeScript',
  },
]

/**
 * @deprecated Use PROTOTYPES array instead
 * Kept for backward compatibility if needed
 */
export const PrototypeMeta = {
  [Routes.GOOD_STUFF_LIST]: {
    description:
      'This prototype enables me to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on my accomplishments (task tracking in Notion).',
    icon: '📝',
    permittedRoles: [UserGroup.Admin],
    stage: PrototypeStage.WIP,
    tech: 'Notion API, OpenAI API',
  },
  [Routes.BUDGET_BOT]: {
    description:
      'A budgeting tool that helps you understand your financial levers by tracking income, expenses, savings, and calculating what you have left for wants.',
    icon: '💰',
    permittedRoles: [UserGroup.Admin],
    stage: PrototypeStage.WIP,
    tech: 'React, TypeScript',
  },
  [Routes.SMS]: {
    description: 'Send quick SMS notifications to any phone number.',
    icon: '💬',
    permittedRoles: [UserGroup.Admin],
    stage: PrototypeStage.WIP,
    tech: 'React, TypeScript',
  },
}
