export type ReportFormat = 'markdown' | 'plaintext'

export interface SavedReport {
  id: string
  user_id: string
  title: string
  content: string
  format: ReportFormat
  prompt_used: string | null
  created_at: string
  updated_at: string
}

export interface CreateSavedReportInput {
  title: string
  content: string
  format?: ReportFormat
  prompt_used?: string | null
}

export interface UpdateSavedReportInput {
  title?: string
  content?: string
  format?: ReportFormat
  prompt_used?: string | null
}
