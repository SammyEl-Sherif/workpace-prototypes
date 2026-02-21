import { NextApiRequest, NextApiResponse } from 'next'

import { createNotionClient } from '@/server/utils/createHttpClient/createNotionClient/createNotionClient'
import { createOpenaiClient } from '@/server/utils/createHttpClient/createOpenaiClient/createOpenaiClient'
import { createSupabaseServerClient } from '@/server/utils/supabase/createSupabaseClient'
import { getSupabaseSession } from '@/server/utils/supabase/getSupabaseSession'
import { requireApiAuth } from '@/server/utils'
import { HttpResponse } from '@/server/types'

interface ContactResult {
  action: 'updated' | 'created'
  contactName: string
  detail: string
  pageId: string
}

export const processContactPromptRoute = requireApiAuth(
  async (req: NextApiRequest, res: NextApiResponse<HttpResponse<ContactResult | null>>) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      res.status(405).json({ data: null, status: 405 })
      return
    }

    try {
      const session = await getSupabaseSession(req)
      if (!session?.user) {
        res.status(401).json({ data: null, status: 401 })
        return
      }

      const { prompt } = req.body as { prompt?: string }
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        res.status(400).json({ data: null, status: 400 })
        return
      }

      // Get user's roledex database
      const supabase = createSupabaseServerClient()
      const { data: dbRecords, error: dbError } = await supabase
        .from('roledex_databases')
        .select('database_id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (dbError || !dbRecords || dbRecords.length === 0) {
        console.error('[Roledex] No database configured:', dbError)
        res.status(400).json({ data: null, status: 400 })
        return
      }

      const databaseId = dbRecords[0].database_id

      // Parse prompt with OpenAI
      const openai = createOpenaiClient()
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You extract contact information from natural language prompts. ' +
              'Return a JSON object with exactly two fields: ' +
              '"contactName" (the person\'s name) and "detail" (the information to record about them). ' +
              'Example: for "John likes baseball", return {"contactName": "John", "detail": "He likes baseball"}.',
          },
          { role: 'user', content: prompt.trim() },
        ],
      })

      const parsed = JSON.parse(completion.choices[0].message.content || '{}') as {
        contactName?: string
        detail?: string
      }

      if (!parsed.contactName || !parsed.detail) {
        res.status(400).json({ data: null, status: 400 })
        return
      }

      const { contactName, detail } = parsed

      // Create Notion client with user's token
      const notion = await createNotionClient(session.user.id)

      // Detect the title property name from the database schema
      const dbMeta = await notion.databases.retrieve({ database_id: databaseId })
      let titlePropertyName = 'Name'
      for (const [key, prop] of Object.entries(dbMeta.properties)) {
        if (prop.type === 'title') {
          titlePropertyName = key
          break
        }
      }

      // Search for existing contact
      const searchResults = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: titlePropertyName,
          title: { contains: contactName },
        },
      })

      // Format timestamp
      const now = new Date()
      const timestamp = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      const bulletText = `[${timestamp}] ${detail}`

      if (searchResults.results.length > 0) {
        // Update existing contact
        const pageId = searchResults.results[0].id

        // Check if "Details" heading already exists
        const blocks = await notion.blocks.children.list({ block_id: pageId })
        const hasDetailsHeading = blocks.results.some(
          (block: any) =>
            block.type === 'heading_2' && block.heading_2?.rich_text?.[0]?.plain_text === 'Details'
        )

        const newBlocks: any[] = []

        if (!hasDetailsHeading) {
          newBlocks.push({
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [{ type: 'text', text: { content: 'Details' } }],
            },
          })
        }

        newBlocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: bulletText } }],
          },
        })

        await notion.blocks.children.append({
          block_id: pageId,
          children: newBlocks,
        })

        res.status(200).json({
          data: { action: 'updated', contactName, detail, pageId },
          status: 200,
        })
      } else {
        // Create new contact
        const newPage = await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            [titlePropertyName]: {
              title: [{ type: 'text', text: { content: contactName } }],
            },
          },
          children: [
            {
              object: 'block',
              type: 'heading_2',
              heading_2: {
                rich_text: [{ type: 'text', text: { content: 'Details' } }],
              },
            },
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: bulletText } }],
              },
            },
          ],
        })

        res.status(201).json({
          data: { action: 'created', contactName, detail, pageId: newPage.id },
          status: 201,
        })
      }
    } catch (error: unknown) {
      console.error('[Roledex] Error processing contact prompt:', error)
      res.status(500).json({ data: null, status: 500 })
    }
  }
)
