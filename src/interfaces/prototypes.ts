import { Routes } from './routes'

export type Prototype = {
  name: string
  path: string
  description: string
}

export const PrototypeMeta = {
  [Routes.GOOD_STUFF_LIST]:
    'This prototype enables me to create valuable artifacts, such as year-end reviews, resume sections, and LinkedIn experience descriptions, based on my accomplishments (task tracking in Notion).',
}
