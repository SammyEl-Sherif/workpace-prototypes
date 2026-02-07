import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

import { PROTOTYPES } from '@/interfaces/prototypes'
import { Routes } from '@/interfaces/routes'

import styles from './SubNavbar.module.scss'

const SubNavbar = () => {
  const router = useRouter()
  const { pathname } = router

  // Get all prototype routes (excluding the index page)
  const prototypeRoutes = useMemo(() => {
    return PROTOTYPES.map((prototype) => ({
      path: prototype.path,
      name: prototype.name.replace(/^[^\s]+\s/, ''), // Remove emoji and keep just the name
    }))
  }, [])

  // Find current prototype index
  const currentIndex = useMemo(() => {
    return prototypeRoutes.findIndex((route) => pathname === route.path)
  }, [pathname, prototypeRoutes])

  // Check if we're on a prototype page
  const isPrototypePage = currentIndex !== -1

  // Define handlers before conditional return (hooks must be called in same order)
  const handlePrevious = useCallback(() => {
    if (currentIndex === -1) return
    const previousIndex = currentIndex === 0 ? prototypeRoutes.length - 1 : currentIndex - 1
    router.push(prototypeRoutes[previousIndex].path)
  }, [currentIndex, prototypeRoutes, router])

  const handleNext = useCallback(() => {
    if (currentIndex === -1) return
    const nextIndex = currentIndex === prototypeRoutes.length - 1 ? 0 : currentIndex + 1
    router.push(prototypeRoutes[nextIndex].path)
  }, [currentIndex, prototypeRoutes, router])

  // If not on a prototype page, don't show the subnavbar
  if (!isPrototypePage) {
    return null
  }

  const currentPrototype = prototypeRoutes[currentIndex]

  return (
    <nav className={styles.subnavbar}>
      <button
        className={styles.arrowButton}
        onClick={handlePrevious}
        aria-label="Previous prototype"
      >
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
      <div className={styles.title}>{currentPrototype.name}</div>
      <button className={styles.arrowButton} onClick={handleNext} aria-label="Next prototype">
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
