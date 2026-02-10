import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

import { APPS } from '@/interfaces/apps'
import { Routes } from '@/interfaces/routes'

import styles from './SubNavbar.module.scss'

const SubNavbar = () => {
  const router = useRouter()
  const { pathname } = router

  // Get all app routes (excluding the index page)
  const appRoutes = useMemo(() => {
    return APPS.map((app) => ({
      path: app.path,
      name: app.name.replace(/^[^\s]+\s/, ''), // Remove emoji and keep just the name
    }))
  }, [])

  // Find current app index
  const currentIndex = useMemo(() => {
    return appRoutes.findIndex((route) => pathname === route.path)
  }, [pathname, appRoutes])

  // Check if we're on an app page
  const isAppPage = currentIndex !== -1

  // Define handlers before conditional return (hooks must be called in same order)
  const handlePrevious = useCallback(() => {
    if (currentIndex === -1) return
    const previousIndex = currentIndex === 0 ? appRoutes.length - 1 : currentIndex - 1
    router.push(appRoutes[previousIndex].path)
  }, [currentIndex, appRoutes, router])

  const handleNext = useCallback(() => {
    if (currentIndex === -1) return
    const nextIndex = currentIndex === appRoutes.length - 1 ? 0 : currentIndex + 1
    router.push(appRoutes[nextIndex].path)
  }, [currentIndex, appRoutes, router])

  // If not on an app page, don't show the subnavbar
  if (!isAppPage) {
    return null
  }

  const currentApp = appRoutes[currentIndex]

  return (
    <nav className={styles.subnavbar}>
      <button className={styles.arrowButton} onClick={handlePrevious} aria-label="Previous app">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className={styles.title}>{currentApp.name}</div>
      <button className={styles.arrowButton} onClick={handleNext} aria-label="Next app">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </nav>
  )
}

export default SubNavbar
