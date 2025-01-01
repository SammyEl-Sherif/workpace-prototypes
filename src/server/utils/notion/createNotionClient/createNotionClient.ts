import { Client } from '@notionhq/client'
import { ClientOptions } from '@notionhq/client/build/src/Client'

export const createNotionClient = (config?: ClientOptions) => {
  const instance = new Client({ auth: process.env.NOTION_API_KEY, ...config })
  return instance
}
