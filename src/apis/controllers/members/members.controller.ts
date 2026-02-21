import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import { HttpResponse } from '@/server/types'
import { createNotionClient } from '@/server/utils/createHttpClient/createNotionClient/createNotionClient'

import { CommunityMember } from './members.types'

const MEMBERS_DATABASE_ID = '2732861133b580c0ac8be7f684c74765'

export const getMembersController = async (): Promise<HttpResponse<CommunityMember[]>> => {
  try {
    const client = await createNotionClient()

    const response = await client.databases.query({
      database_id: MEMBERS_DATABASE_ID,
    })

    const members: CommunityMember[] = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        const props = page.properties as Record<string, any>

        let name = 'Unknown'
        const nameProp = props['Name']
        if (nameProp?.type === 'title' && nameProp.title?.length > 0) {
          name = nameProp.title[0].plain_text || 'Unknown'
        }

        let jobTitle: string | null = null
        const jobTitleProp = props['Job Title']
        if (jobTitleProp?.type === 'rich_text' && jobTitleProp.rich_text?.length > 0) {
          jobTitle = jobTitleProp.rich_text[0].plain_text || null
        }

        let location: string | null = null
        const locationProp = props['Location']
        if (locationProp?.type === 'select' && locationProp.select) {
          location = locationProp.select.name || null
        }

        let joined: string | null = null
        const joinedProp = props['Joined']
        if (joinedProp?.type === 'date' && joinedProp.date) {
          joined = joinedProp.date.start || null
        }

        let linkedIn: string | null = null
        const linkedInProp = props['LinkedIn']
        if (linkedInProp?.type === 'url') {
          linkedIn = linkedInProp.url || null
        }

        let coverImage: string | null = null
        if (page.cover) {
          if (page.cover.type === 'external') {
            coverImage = page.cover.external.url
          } else if (page.cover.type === 'file') {
            coverImage = page.cover.file.url
          }
        }

        return {
          id: page.id,
          name,
          jobTitle,
          location,
          joined,
          linkedIn,
          coverImage,
        }
      })

    return {
      data: members,
      status: 200,
    }
  } catch (error) {
    console.error('[getMembersController] Error:', error)
    return {
      data: [],
      status: 500,
    }
  }
}
