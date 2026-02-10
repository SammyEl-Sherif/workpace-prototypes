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
  // In this workspace setup, Next.js runs from the src directory
  // So process.cwd() will be the src directory, not the project root
  const cwd = process.cwd()

  // Determine the base path for SQL files
  // In Next.js compiled code, __dirname points to .next/server/pages/api/...
  // We need to find the src directory
  let sqlBasePath: string

  if (__dirname.includes('.next')) {
    // We're in compiled Next.js code
    // __dirname will be something like: /path/to/src/.next/server/pages/api/db/...
    // We need to extract the src directory path
    const nextIndex = __dirname.indexOf('.next')
    sqlBasePath = __dirname.substring(0, nextIndex)
  } else {
    // We're in development or the file is in its original location
    // __dirname will be: /path/to/src/db
    // So we go up one level to get src, then use db/sql
    sqlBasePath = path.resolve(__dirname, '..')
  }

  // Check if sqlBasePath ends with 'src'
  const isSrcDir =
    sqlBasePath.endsWith('src') ||
    sqlBasePath.endsWith(path.sep + 'src') ||
    sqlBasePath.endsWith('/src') ||
    sqlBasePath.endsWith('\\src')

  const possiblePaths = [
    // Primary: try from process.cwd() directly (most likely - cwd is src directory)
    path.join(cwd, 'db', 'sql', relativePath),
    // Secondary: if base is src directory, db/sql is directly under it
    isSrcDir ? path.join(sqlBasePath, 'db', 'sql', relativePath) : null,
    // Alternative: if base is project root, use src/db/sql
    !isSrcDir ? path.join(sqlBasePath, 'src', 'db', 'sql', relativePath) : null,
    // Fallback: try from process.cwd() with src (in case cwd is project root)
    path.join(cwd, 'src', 'db', 'sql', relativePath),
    // Last resort: relative to __dirname
    path.join(__dirname, 'sql', relativePath),
  ].filter((p): p is string => p !== null)

  let sqlContent: string | null = null
  let foundPath: string | null = null

  for (const filePath of possiblePaths) {
    try {
      const normalizedPath = path.normalize(filePath)
      if (fs.existsSync(normalizedPath)) {
        sqlContent = fs.readFileSync(normalizedPath, 'utf8')
        foundPath = normalizedPath
        break
      }
    } catch {
      // Continue trying other paths
    }
  }

  if (!sqlContent) {
    throw new Error(
      `SQL file not found: ${relativePath}\nSearched paths:\n${possiblePaths
        .map((p) => `  - ${path.normalize(p)}`)
        .join(
          '\n'
        )}\nSQL base path: ${sqlBasePath}\n__dirname: ${__dirname}\nprocess.cwd(): ${cwd}\nIs src dir: ${isSrcDir}`
    )
  }

  // Cache and return
  sqlCache.set(relativePath, sqlContent)

  // Only log SQL loading if DEBUG_SQL_LOADING is enabled (very verbose)
  if (process.env.DEBUG_SQL_LOADING === 'true') {
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
