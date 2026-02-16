import { useCallback, useEffect, useState } from 'react'

import { Button } from '@workpace/design-system'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useSupabaseSession, useUser } from '@/hooks'
import { Routes } from '@/interfaces/routes'
import { UserGroup } from '@/interfaces/user'
import Logo from '@/public/favicon.ico'

import { ProfileDropdown } from '@/components/ProfileDropdown'
import styles from './StandardNavbar.module.scss'

// Type assertion workaround for Button component type issue
const ButtonComponent = Button as any

interface StandardNavbarProps {
  transparent?: boolean
}

const StandardNavbar = ({ transparent = false }: StandardNavbarProps) => {
  const { data, status } = useSession()
  const { user: supabaseUser, isAuthenticated: isSupabaseAuthenticated } = useSupabaseSession()
  const { user, signOut } = useUser()
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Check if user is authenticated via either NextAuth or Supabase
  const isAuthenticated = status === 'authenticated' || isSupabaseAuthenticated
  const isAdmin = user?.roles?.includes(UserGroup.Admin) ?? false

  const handleSignIn = () => {
    router.push(Routes.SIGNIN)
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  const closeMobileNav = () => {
    setIsMobileNavOpen(false)
  }

  const handleProfileClick = () => {
    router.push(Routes.PROFILE)
    closeMobileNav()
  }

  const handleFriendsClick = () => {
    router.push(Routes.FRIENDS)
    closeMobileNav()
  }

  const handleAdminClick = () => {
    router.push(Routes.ADMIN)
    closeMobileNav()
  }

  const handleSignOut = () => {
    signOut()
    closeMobileNav()
  }

  // Scroll shadow effect
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <>
      <nav
        className={cn(styles.navbar, {
          [styles.scrolled]: isScrolled,
          [styles.transparent]: transparent && !isScrolled,
        })}
      >
        <div className={styles.container}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              <Image src={Logo} alt="Logo" className={styles.logo} />
              WorkPace
            </Link>
          </div>

          <div className={styles.navLinks}>
            <Link href={Routes.APPS} className={styles.navLink}>
              Apps
            </Link>
            <Link href={Routes.TEMPLATES} className={styles.navLink}>
              Templates
            </Link>
            <Link href={Routes.ABOUT} className={styles.navLink}>
              About
            </Link>
          </div>
          <div className={styles.authSection}>
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <ButtonComponent onClick={handleSignIn} variant="default-secondary">
                Sign In
              </ButtonComponent>
            )}
          </div>
          <button
            type="button"
            className={styles.hamburgerButton}
            onClick={toggleMobileNav}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileNavOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMobileNav} aria-hidden="true" />
      )}

      {/* Mobile Menu */}
      <div className={cn(styles.mobileMenu, { [styles.mobileMenuOpen]: isMobileNavOpen })}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink} onClick={closeMobileNav}>
              <Image src={Logo} alt="Logo" className={styles.logo} />
              WorkPace
            </Link>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeMobileNav}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="#191919"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66a8,8,0,0,1,11.32-11.32L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
        </div>

        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileNavLinks}>
            <Link href={Routes.APPS} className={styles.mobileNavLink} onClick={closeMobileNav}>
              Apps
            </Link>
            <Link href={Routes.TEMPLATES} className={styles.mobileNavLink} onClick={closeMobileNav}>
              Templates
            </Link>
            <Link href={Routes.ABOUT} className={styles.mobileNavLink} onClick={closeMobileNav}>
              About
            </Link>
            {isAuthenticated && (
              <>
                <button onClick={handleProfileClick} className={styles.mobileNavLink}>
                  Profile
                </button>
                <button onClick={handleFriendsClick} className={styles.mobileNavLink}>
                  Friends
                </button>
                {isAdmin && (
                  <button onClick={handleAdminClick} className={styles.mobileNavLink}>
                    Admin
                  </button>
                )}
                <div className={styles.mobileDivider} />
                <button onClick={handleSignOut} className={styles.mobileNavLink}>
                  Sign Out
                </button>
              </>
            )}
          </div>

          <div className={styles.mobileAuthSection}>
            {isAuthenticated ? (
              <ButtonComponent variant="default-secondary" className={styles.accountButton}>
                Account
              </ButtonComponent>
            ) : (
              <ButtonComponent onClick={handleSignIn} variant="default-secondary">
                Sign In
              </ButtonComponent>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default StandardNavbar
