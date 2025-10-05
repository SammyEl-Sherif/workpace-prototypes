export type Environment = 'local' | 'docker' | 'production'

export const getEnvironment = (): Environment => {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    // Server-side: check for Docker environment variables
    if (process.env.DOCKER_CONTAINER === 'true') {
      return 'docker'
    }
    if (process.env.NODE_ENV === 'production') {
      return 'production'
    }
    return 'local'
  }

  // Client-side: check for Docker indicator
  if (process.env.NEXT_PUBLIC_DOCKER_CONTAINER === 'true') {
    return 'docker'
  }
  if (process.env.NODE_ENV === 'production') {
    return 'production'
  }
  return 'local'
}

export default getEnvironment
