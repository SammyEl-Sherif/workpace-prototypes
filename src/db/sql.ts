import fs from 'fs'
import path from 'path'

const sqlCache = new Map<string, string>()

export function loadSql(relativePath: string): string {
  if (sqlCache.has(relativePath)) return sqlCache.get(relativePath)!

  // e.g. relativePath = 'restaurants/get_restaurants.sql'
  // In Next.js, we need to look in the src/sql directory
  const sqlDir = path.join(process.cwd(), 'src', 'sql')
  const filePath = path.join(sqlDir, relativePath)

  if (!fs.existsSync(filePath)) {
    throw new Error(`SQL file not found: ${filePath}`)
  }

  const text = fs.readFileSync(filePath, 'utf8')
  sqlCache.set(relativePath, text)
  return text
}
