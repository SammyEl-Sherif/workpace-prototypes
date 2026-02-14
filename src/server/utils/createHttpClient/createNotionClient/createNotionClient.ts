import { Client } from '@notionhq/client'
import { ClientOptions } from '@notionhq/client/build/src/Client'
import { createSupabaseServerClient } from '../../supabase/createSupabaseClient'

/**
 * Creates a Notion client with a user-specific access token
 * Falls back to the default API key if no user token is available
 */
export const createNotionClient = async (
  userId?: string,
  config?: ClientOptions
): Promise<Client> => {
  let authToken = process.env.NOTION_API_KEY

  // If userId is provided, try to get their personal Notion token
  if (userId) {
    try {
      const supabase = createSupabaseServerClient()
      const { data } = await supabase
        .from('notion_connections')
        .select('access_token')
        .eq('user_id', userId)
        .single()

      if (data?.access_token) {
        authToken = data.access_token
      }
    } catch (error) {
      // If we can't get user token, fall back to default API key
      console.warn('Could not fetch user Notion token, using default:', error)
    }
  }

  if (!authToken) {
    throw new Error('No Notion authentication token available')
  }

  return new Client({ auth: authToken, ...config })
}

/**
 * Creates a Notion client with a specific access token
 */
export const createNotionClientWithToken = (
  accessToken: string,
  config?: ClientOptions
): Client => {
  return new Client({ auth: accessToken, ...config })
}
