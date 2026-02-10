export interface App {
  id: string
  name: string
  description?: string
  [key: string]: unknown
}
