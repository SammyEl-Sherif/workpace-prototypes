import { Client } from '@notionhq/client'
import { HttpResponse } from '@/server/types'
import { createSupabaseServerClient } from '@/server/utils'

export const getNotionOAuthUrl = (): string => {
  const clientId = process.env.NOTION_CLIENT_ID
  const redirectUri =
    process.env.NOTION_REDIRECT_URI ||
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notion/oauth/callback`

  if (!clientId) {
    throw new Error('NOTION_CLIENT_ID is not configured')
  }

  const state =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    owner: 'user',
    state,
  })

  return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`
}

export const exchangeNotionCodeForToken = async (
  code: string
): Promise<
  HttpResponse<{
    access_token: string
    workspace_id?: string
    workspace_name?: string
    bot_id?: string
    notion_user_id?: string
  }>
> => {
  const clientId = process.env.NOTION_CLIENT_ID
  const clientSecret = process.env.NOTION_CLIENT_SECRET
  const redirectUri =
    process.env.NOTION_REDIRECT_URI ||
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notion/oauth/callback`

  if (!clientId || !clientSecret) {
    throw new Error('Notion OAuth credentials are not configured')
  }

  try {
    // Notion OAuth requires Basic Auth with client_id:client_secret
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { error: errorText || 'Failed to exchange code' }
      }
      console.error('[Notion OAuth] Token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        error,
      })
      throw new Error(error.error || error.message || 'Failed to exchange authorization code')
    }

    const data = await response.json()

    // Get workspace info and user's actual Notion ID using the access token
    const notionClient = new Client({ auth: data.access_token })
    let workspaceId: string | undefined
    let workspaceName: string | undefined
    let botId: string | undefined
    let notionUserId: string | undefined

    try {
      const user = await notionClient.users.me({})
      botId = user.id

      // Try to get workspace info from the first database
      const searchResults = await notionClient.search({
        filter: {
          value: 'database',
          property: 'object',
        },
        page_size: 1,
      })

      if (searchResults.results.length > 0 && 'parent' in searchResults.results[0]) {
        const parent = searchResults.results[0].parent
        if ('workspace' in parent) {
          workspaceId = parent.workspace ? 'true' : undefined
        }
      }

      // Get the user's actual Notion ID by querying pages they created
      // Query a few pages and find the most common creator ID (should be the user)
      try {
        const pageQuery = await notionClient.search({
          filter: {
            value: 'page',
            property: 'object',
          },
          page_size: 20, // Get more pages for better detection
        })

        // Count occurrences of each user ID in created_by
        const userIdCounts: Record<string, number> = {}
        for (const page of pageQuery.results as any[]) {
          if (page.created_by && page.created_by.id && page.created_by.object === 'user') {
            const creatorId = page.created_by.id
            // Exclude the bot ID
            if (creatorId !== botId) {
              userIdCounts[creatorId] = (userIdCounts[creatorId] || 0) + 1
            }
          }
        }

        // The most common creator ID (excluding bot) is likely the actual user
        const sortedIds = Object.entries(userIdCounts).sort((a, b) => b[1] - a[1])
        if (sortedIds.length > 0 && sortedIds[0][1] >= 2) {
          // Only use if it appears at least twice (more reliable)
          notionUserId = sortedIds[0][0]
          console.log(
            '[Notion OAuth] Detected user Notion ID:',
            notionUserId,
            'Count:',
            sortedIds[0][1]
          )
        } else {
          console.warn('[Notion OAuth] Could not reliably detect user Notion ID from sample pages')
        }
      } catch (err) {
        console.warn('[Notion OAuth] Could not detect user Notion ID:', err)
      }
    } catch (err) {
      // If we can't get workspace info, continue without it
      console.warn('Could not fetch workspace info:', err)
    }

    return {
      data: {
        access_token: data.access_token,
        workspace_id: workspaceId,
        workspace_name: workspaceName,
        bot_id: botId,
        notion_user_id: notionUserId,
      },
      status: 200,
    }
  } catch (error: any) {
    return {
      data: {
        access_token: '',
        workspace_id: undefined,
        workspace_name: undefined,
        bot_id: undefined,
        notion_user_id: undefined,
      },
      status: 500,
    }
  }
}

export const saveNotionConnection = async (
  userId: string,
  accessToken: string,
  workspaceId?: string | null,
  workspaceName?: string | null,
  botId?: string | null,
  notionUserId?: string | null
): Promise<HttpResponse<{ connection: any }>> => {
  const supabase = createSupabaseServerClient()

  try {
    // Check if connection already exists
    const { data: existing } = await supabase
      .from('notion_connections')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existing) {
      // Update existing connection
      const { data, error } = await supabase
        .from('notion_connections')
        .update({
          access_token: accessToken,
          workspace_id: workspaceId,
          workspace_name: workspaceName,
          bot_id: botId,
          notion_user_id: notionUserId,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return {
        data: { connection: data },
        status: 200,
      }
    } else {
      // Create new connection
      const { data, error } = await supabase
        .from('notion_connections')
        .insert({
          user_id: userId,
          access_token: accessToken,
          workspace_id: workspaceId,
          workspace_name: workspaceName,
          bot_id: botId,
          notion_user_id: notionUserId,
        })
        .select()
        .single()

      if (error) throw error

      return {
        data: { connection: data },
        status: 201,
      }
    }
  } catch (error: any) {
    return {
      data: { connection: null },
      status: 500,
    }
  }
}

export const getNotionConnection = async (
  userId: string
): Promise<HttpResponse<{ connection: any | null }>> => {
  const supabase = createSupabaseServerClient()

  try {
    const { data, error } = await supabase
      .from('notion_connections')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine
      throw error
    }

    return {
      data: { connection: data || null },
      status: 200,
    }
  } catch (error: any) {
    return {
      data: { connection: null },
      status: 500,
    }
  }
}

export const deleteNotionConnection = async (
  userId: string
): Promise<HttpResponse<{ success: boolean }>> => {
  const supabase = createSupabaseServerClient()

  try {
    const { error } = await supabase.from('notion_connections').delete().eq('user_id', userId)

    if (error) throw error

    return {
      data: { success: true },
      status: 200,
    }
  } catch (error: any) {
    return {
      data: { success: false },
      status: 500,
    }
  }
}
