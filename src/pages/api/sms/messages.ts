import { NextApiRequest, NextApiResponse } from 'next'

import { createSupabaseServerClient } from '@/server/utils/supabase/createSupabaseClient'
import { HttpResponse } from '@/server/types'
import { withSupabaseAuth } from '@/server/utils'
import { HttpMethod } from '@/interfaces/httpMethod'
import { apiRequestWrapper } from '@/server/apiRequestWrapper'

export interface InboundMessage {
  id: string
  type: 'text' | 'email'
  sender_phone_number: string | null
  sender_email: string | null
  sender_name: string | null
  message_body: string
  subject: string | null
  received_at: string
  pingram_message_id: string | null
  created_at: string
  updated_at: string
}

const getMessagesController = withSupabaseAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse<HttpResponse<{ messages: InboundMessage[] }>>,
    session
  ) => {
    try {
      if (!session.user) {
        res.status(401).json({
          data: { messages: [] },
          status: 401,
        })
        return
      }

      // Get query parameters
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50
      const offset = req.query.offset ? parseInt(String(req.query.offset), 10) : 0
      const type = req.query.type as 'text' | 'email' | undefined

      // Create Supabase client
      const supabase = createSupabaseServerClient()

      // Build query
      let query = supabase
        .from('inbound_messages')
        .select('*')
        .order('received_at', { ascending: false })
        .range(offset, offset + limit - 1)

      // Filter by type if provided
      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query

      if (error) {
        console.error('[getMessagesController] Supabase error:', error)
        res.status(500).json({
          data: { messages: [] },
          status: 500,
        })
        return
      }

      res.status(200).json({
        data: { messages: (data || []) as InboundMessage[] },
        status: 200,
      })
    } catch (error: unknown) {
      console.error('[getMessagesController] Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('[getMessagesController] Error details:', errorMessage)

      res.status(500).json({
        data: { messages: [] },
        status: 500,
      })
    }
  }
)

export default apiRequestWrapper({
  [HttpMethod.GET]: getMessagesController,
})
