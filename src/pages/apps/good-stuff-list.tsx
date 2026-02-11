import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout'
import { withPageRequestWrapper } from '@/server/utils'
import { GoodThingsListPage } from '@/modules/GoodThingsList'
import { GoodThingsService } from '@/apis/controllers/good-things/good-things.service'
import { GoodThingMediaService } from '@/apis/controllers/good-things/good-thing-media.service'
import { GoodThing, GoodThingMedia } from '@/interfaces/good-things'

interface GoodStuffListPageProps {
  goodThings: GoodThing[]
  mediaByGoodThingId: Record<string, GoodThingMedia[]>
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const { req } = context

  // Get user ID from session
  const { getSupabaseSession } = await import('@/server/utils/supabase/getSupabaseSession')
  const { getNextAuthJWT } = await import('@/server/utils/getNextAuthJWT')

  let userId: string | undefined

  // Try NextAuth session first
  const session = await getNextAuthJWT(req)
  if (session) {
    userId = (session as any)?.id || (session as any)?.user?.id
  } else {
    // Fall back to Supabase session
    const supabaseSession = await getSupabaseSession(req as any)
    userId = supabaseSession?.user?.id
  }

  if (!userId) {
    return {
      goodThings: [],
      mediaByGoodThingId: {},
    }
  }

  // Fetch all good things
  const goodThings = await GoodThingsService.getAll(userId)

  // Serialize good things to ensure Date objects are converted to strings
  const serializedGoodThings: GoodThing[] = goodThings.map((gt) => ({
    ...gt,
    completion_date: gt.completion_date
      ? typeof gt.completion_date === 'string'
        ? gt.completion_date
        : new Date(gt.completion_date as any).toISOString()
      : null,
    created_at:
      typeof gt.created_at === 'string'
        ? gt.created_at
        : new Date(gt.created_at as any).toISOString(),
    updated_at:
      typeof gt.updated_at === 'string'
        ? gt.updated_at
        : new Date(gt.updated_at as any).toISOString(),
  }))

  // Fetch all media for all good things in a single batch query
  const goodThingIds = serializedGoodThings.map((gt) => gt.id)
  const allMedia =
    goodThingIds.length > 0
      ? await GoodThingMediaService.getByGoodThingIds(goodThingIds, userId)
      : []

  // Serialize media and group by good_thing_id
  const mediaByGoodThingId: Record<string, GoodThingMedia[]> = {}
  for (const media of allMedia) {
    // Serialize media dates
    const serializedMedia: GoodThingMedia = {
      ...media,
      created_at:
        typeof media.created_at === 'string'
          ? media.created_at
          : new Date(media.created_at as any).toISOString(),
    }

    if (!mediaByGoodThingId[serializedMedia.good_thing_id]) {
      mediaByGoodThingId[serializedMedia.good_thing_id] = []
    }
    mediaByGoodThingId[serializedMedia.good_thing_id].push(serializedMedia)
  }

  return {
    goodThings: serializedGoodThings,
    mediaByGoodThingId,
  }
})

const HomePage = ({ goodThings, mediaByGoodThingId }: GoodStuffListPageProps) => {
  return (
    <>
      <DocumentTitle title="Good Stuff List" />
      <GoodThingsListPage
        initialGoodThings={goodThings}
        initialMediaByGoodThingId={mediaByGoodThingId}
      />
    </>
  )
}

export default HomePage
