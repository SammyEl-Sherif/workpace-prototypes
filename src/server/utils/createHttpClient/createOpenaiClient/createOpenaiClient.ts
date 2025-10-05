import { ClientOptions } from '@notionhq/client/build/src/Client'
import OpenAI from 'openai'

export const createOpenaiClient = (config?: ClientOptions) => {
  const instance = new OpenAI({
    organization: process.env.OPENAI_ORG_ID || '',
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_API_KEY,
  })
  return instance
}
