import fs from 'fs'
import path from 'path'

const sqlCache = new Map<string, string>()

/**
 * Load a SQL file from the src/db/sql directory
 * Works with both development (tsx) and production (Vercel) environments
 *
 * @param relativePath - Path relative to the sql directory (e.g., 'restaurants/get_restaurants.sql')
 * @returns The SQL query string
 */
export function loadSql(relativePath: string): string {
  // Check cache first
  if (sqlCache.has(relativePath)) {
    return sqlCache.get(relativePath)!
  }

  // Resolve the SQL file path
  // In Next.js/Vercel, process.cwd() is the project root
  const possiblePaths = [
    // Production: files are in the .next/server folder or root
    path.join(process.cwd(), 'src', 'db', 'sql', relativePath),
    // Alternative: if sql files are copied to public or another location
    path.join(process.cwd(), 'sql', relativePath),
    // Development with tsx/ts-node
    path.join(__dirname, 'sql', relativePath),
  ]

  let sqlContent: string | null = null
  let foundPath: string | null = null

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        sqlContent = fs.readFileSync(filePath, 'utf8')
        foundPath = filePath
        break
      }
    } catch {
      // Continue trying other paths
    }
  }

  if (!sqlContent) {
    throw new Error(
      `SQL file not found: ${relativePath}\nSearched paths:\n${possiblePaths
        .map((p) => `  - ${p}`)
        .join('\n')}`
    )
  }

  // Cache and return
  sqlCache.set(relativePath, sqlContent)

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[SQL] Loaded: ${relativePath} from ${foundPath}`)
  }

  return sqlContent
}

/**
 * Clear the SQL cache (useful for testing)
 */
export function clearSqlCache(): void {
  sqlCache.clear()
}
