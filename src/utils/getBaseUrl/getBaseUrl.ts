/**
 * Gets the base URL for the current environment
 *
 * On client-side: Uses window.location.origin to automatically detect the current origin
 * On server-side: Uses NEXTAUTH_URL or falls back to environment-based defaults
 *
 * @returns The base URL (e.g., 'http://localhost:3000', 'https://dev.workpace.io', 'https://workpace.io')
 */
export const getBaseUrl = (): string => {
  // Client-side: use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side: check NEXTAUTH_URL first (most reliable)
  if (process.env.NEXTAUTH_URL) {
    try {
      const url = new URL(process.env.NEXTAUTH_URL)
      return url.origin
    } catch {
      // If NEXTAUTH_URL is malformed, fall through to defaults
    }
  }

  // Fallback: use environment-based defaults
  if (process.env.NODE_ENV === 'production') {
    // In production, default to workpace.io
    // This will be overridden by NEXTAUTH_URL in most cases
    return 'https://workpace.io'
  }

  // Development/local fallback
  return 'http://localhost:3000'
}

export default getBaseUrl
