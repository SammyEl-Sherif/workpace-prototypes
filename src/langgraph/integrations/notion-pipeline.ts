import { createNotionClient } from '@/server/utils/createHttpClient/createNotionClient/createNotionClient'

const ADMIN_USER_ID = process.env.ADMIN_USER_ID ?? ''
const PIPELINE_DB_ID = process.env.NOTION_PIPELINE_DB_ID ?? ''
const PROJECTS_DB_ID = process.env.NOTION_PROJECTS_DB_ID ?? ''

const getNotionClient = () => createNotionClient(ADMIN_USER_ID)

interface CreatePipelineData {
  clientName: string
  clientEmail: string
  clientPhone: string
  source: string
  meetingDatetime?: string | null
  threadId: string
}

export async function createPipelineRecord(data: CreatePipelineData): Promise<string> {
  const properties: Record<string, unknown> = {
    Opportunity: { title: [{ text: { content: data.clientName } }] },
    Email: { email: data.clientEmail },
    Phone: { phone_number: data.clientPhone },
    Source: { select: { name: data.source } },
    Status: { status: { name: 'New Lead' } },
    'LangGraph Thread ID': { rich_text: [{ text: { content: data.threadId } }] },
    'Last Activity': { date: { start: new Date().toISOString() } },
    'Reminder Count': { number: 0 },
  }

  if (data.meetingDatetime) {
    properties['Meeting Date'] = { date: { start: data.meetingDatetime } }
  }

  const notion = await getNotionClient()
  const page = await notion.pages.create({
    parent: { database_id: PIPELINE_DB_ID },
    properties: properties as any,
  })

  return page.id
}

export async function updatePipelineStatus(pageId: string, status: string) {
  const notion = await getNotionClient()
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Status: { status: { name: status } } as any,
      'Last Activity': { date: { start: new Date().toISOString() } } as any,
    },
  })
}

export async function updatePipelineFields(pageId: string, fields: Record<string, unknown>) {
  const notion = await getNotionClient()
  await notion.pages.update({
    page_id: pageId,
    properties: fields as any,
  })
}

interface CreateProjectData {
  clientName: string
  scopeOfWork: string
  contractUrl?: string | null
  pipelinePageId: string
}

export async function createProjectRecord(data: CreateProjectData): Promise<string> {
  const notion = await getNotionClient()
  const page = await notion.pages.create({
    parent: { database_id: PROJECTS_DB_ID },
    properties: {
      'Project Name': {
        title: [{ text: { content: `${data.clientName} — Notion Workspace` } }],
      },
      'Scope of Work': {
        rich_text: [{ text: { content: data.scopeOfWork.slice(0, 2000) } }],
      },
      Status: { select: { name: 'Not Started' } },
      'Start Date': { date: { start: new Date().toISOString() } },
    } as any,
  })

  return page.id
}
