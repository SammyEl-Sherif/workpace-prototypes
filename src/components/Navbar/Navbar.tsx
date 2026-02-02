import { useState } from 'react'

import { Button } from '@workpace/design-system'
import cn from 'classnames'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

import { useSupabaseSession, useUser } from '@/hooks'
import { Prototype } from '@/interfaces/prototypes'
import { Routes } from '@/interfaces/routes'
import { usePrototypesContext } from '@/modules'
import Logo from '@/public/favicon.ico'
import { getAppName } from '@/utils'

import { EnvironmentIndicator } from '../EnvironmentIndicator'
import styles from './Navbar.module.scss'

// Type assertion workaround for Button component type issue
const ButtonComponent = Button as any

export const Navbar = () => {
  const { data, status } = useSession()
  const { user, signOut } = useUser()
  const {
    user: supabaseUser,
    isAuthenticated: isSupabaseAuthenticated,
    isLoading: isSupabaseLoading,
  } = useSupabaseSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const { prototypes } = usePrototypesContext()

  // Check if user is authenticated via either NextAuth or Supabase
  const isAuthenticated = status === 'authenticated' || isSupabaseAuthenticated
  const displayUser = data?.user || supabaseUser
  const userName =
    (displayUser && 'name' in displayUser ? displayUser.name : null) ||
    (supabaseUser && 'user_metadata' in supabaseUser ? supabaseUser.user_metadata?.name : null) ||
    (displayUser && 'email' in displayUser ? displayUser.email : null) ||
    (supabaseUser && 'email' in supabaseUser ? supabaseUser.email : null) ||
    'User'

  const handleClick = () => {
    setIsCollapsed(!isCollapsed)
  }

  const openMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  return (
    <>
      <div className={styles.mobileNav}>
        <Link href={Routes.HOME} className={styles.logoName}>
          <Image src={Logo} alt="Logo" className={styles.logo} />
          <h1 className={cn(styles.brandName, { [styles.hide]: isCollapsed })}>{getAppName()}</h1>
        </Link>
        <a onClick={openMobileNav}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="#191919"
            viewBox="0 0 256 256"
          >
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
          </svg>
        </a>
      </div>
      <div className={cn(styles.mobileMenu, { [styles.mobileMenuOpen]: isMobileNavOpen })}>
        <div className={styles.mobileLinkStackWrapper}>
          <div className={styles.mobileLinkStack}>
            <div className={styles.headingAndLinks}>
              <div className={cn(styles.linksHeading, { [styles.hide]: isCollapsed })}>
                Prototypes
              </div>
              <div className={styles.links}>
                {prototypes &&
                  prototypes.map(({ path, name }: Prototype) => {
                    return (
                      <Link className={styles.links} href={path} key={path}>
                        {name}
                      </Link>
                    )
                  })}
              </div>
            </div>
            <div className={styles.headingAndLinks}>
              <div className={styles.linksHeading}>Info</div>
              <div className={styles.links}>
                <Link href={Routes.DESIGN_SYSTEM} className={styles.links}>
                  🎨 Design System
                </Link>
                <Link href={Routes.SYSTEM_DESIGN} className={styles.links}>
                  🏗️ System Design
                </Link>
              </div>
            </div>
            <div className={styles.headingAndLinks}>
              <div className={styles.linksHeading}>Learn More</div>
              <div className={styles.links}>
                <Link href={Routes.ABOUT} className={styles.links}>
                  👋 About Us
                </Link>
                <Link href={Routes.PROFILE} className={styles.links}>
                  👤 My Profile
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.authStatus}>
            {isAuthenticated ? (
              <div
                title={Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles}
                className={cn(styles.username, {
                  [styles.hide]: isCollapsed,
                })}
              >
                {userName}
              </div>
            ) : (
              <>🚫</>
            )}
            {isAuthenticated ? (
              <ButtonComponent
                onClick={signOut}
                variant="default-secondary"
                className={cn({ [styles.hide]: isCollapsed })}
              >
                Sign out
              </ButtonComponent>
            ) : (
              <ButtonComponent
                onClick={() => (window.location.href = '/signin')}
                variant="brand-secondary"
                className={cn({ [styles.hide]: isCollapsed })}
              >
                Sign In
              </ButtonComponent>
            )}
          </div>
        </div>
        <a onClick={openMobileNav} className={styles.mobileIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="#191919"
            viewBox="0 0 256 256"
          >
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
          </svg>
        </a>
      </div>
      <div className={cn(styles.container, { [styles.collapsed]: isCollapsed })}>
        <div className={styles.brandContainer}>
          {isCollapsed ? (
            <div
              className={styles.logoName}
              onClick={(e) => {
                e.preventDefault()
                handleClick()
              }}
              title="Expand"
            >
              <Image src={Logo} alt="Logo" className={styles.logo} />
              <h1 className={cn(styles.brandName, { [styles.hide]: isCollapsed })}>
                {getAppName()}
              </h1>
            </div>
          ) : (
            <>
              <Link className={styles.logoName} href={Routes.HOME}>
                <Image src={Logo} alt="Logo" className={styles.logo} />
                <h1 className={cn(styles.brandName, { [styles.hide]: isCollapsed })}>
                  {getAppName()}
                </h1>
              </Link>
              <div className={styles.collapse} onClick={handleClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#191919"
                  viewBox="0 0 256 256"
                >
                  <path d="M197.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L123.31,128ZM72,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,72,40Z"></path>
                </svg>
              </div>
            </>
          )}
        </div>
        <div className={cn(styles.linkStack)}>
          {/* Prototypes Section */}
          <div className={styles.section}>
            <div className={cn(styles.linksHeading, { [styles.hide]: isCollapsed })}>
              Prototypes
            </div>
            {!isCollapsed &&
              prototypes &&
              prototypes.length > 0 &&
              prototypes.map(({ path, name }: Prototype) => {
                return (
                  <Link className={styles.links} href={path} key={path}>
                    {name}
                  </Link>
                )
              })}
            {!isCollapsed && (!prototypes || prototypes.length === 0) && (
              <div className={styles.emptyState}>No prototypes available</div>
            )}
            {isCollapsed && (
              <div className={styles.iconLinkStack}>
                <Link className={styles.iconLinks} href={Routes.HOME} title="Home">
                  🏠
                </Link>
                {prototypes &&
                  prototypes.map(({ path, name, icon }: Prototype) => {
                    return (
                      <Link className={styles.links} href={path} title={name} key={path}>
                        {icon}
                      </Link>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className={styles.section}>
            <div className={cn(styles.divider, { [styles.hide]: isCollapsed })} />
            <div className={cn(styles.linksHeading, { [styles.hide]: isCollapsed })}>Info</div>
            {!isCollapsed && (
              <>
                <Link className={styles.links} href={Routes.DESIGN_SYSTEM}>
                  🎨 Design System
                </Link>
                <Link className={styles.links} href={Routes.SYSTEM_DESIGN}>
                  🏗️ System Design
                </Link>
              </>
            )}
            {isCollapsed && (
              <>
                <Link className={styles.links} href={Routes.DESIGN_SYSTEM} title="Design System">
                  🎨
                </Link>
                <Link className={styles.links} href={Routes.SYSTEM_DESIGN} title="System Design">
                  🏗️
                </Link>
              </>
            )}
          </div>
        </div>
        <div className={styles.bottomSection}>
          <EnvironmentIndicator hideText={isCollapsed} />
          <div className={cn(styles.divider, { [styles.hide]: isCollapsed })} />
          <div className={cn(styles.authStatus, { [styles.hide]: isCollapsed })}>
            {isAuthenticated ? (
              <div
                title={Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles}
                className={cn(styles.username, {
                  [styles.hide]: isCollapsed,
                })}
              >
                {userName}
              </div>
            ) : (
              <>🚫</>
            )}
            {isAuthenticated ? (
              <ButtonComponent
                onClick={signOut}
                variant="default-secondary"
                className={cn({ [styles.hide]: isCollapsed })}
              >
                Sign out
              </ButtonComponent>
            ) : (
              <ButtonComponent
                onClick={() => (window.location.href = '/signin')}
                variant="brand-secondary"
                className={cn({ [styles.hide]: isCollapsed })}
              >
                Sign In
              </ButtonComponent>
            )}
          </div>
        </div>
        {isCollapsed && (
          <div
            /* href={Routes.PROFILE} */
            className={styles.profile}
            title={Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles}
          >
            {userName?.[0].toUpperCase() ?? 'N/A'}
          </div>
        )}
      </div>
    </>
  )
}
