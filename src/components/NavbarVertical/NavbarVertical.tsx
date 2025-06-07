import { useState } from 'react'

import cn from 'classnames'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

import { useUser } from '@/hooks'
import { Prototype } from '@/interfaces/prototypes'
import { Routes } from '@/interfaces/routes'
import { usePrototypesContext } from '@/modules'
import Logo from '@/public/favicon.ico'
import { getAppName } from '@/utils'

import styles from './NavbarVertical.module.scss'

export const NavbarVertical = () => {
  const { data, status } = useSession()
  const { user, signOut } = useUser()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const {
    state: { prototypes },
  } = usePrototypesContext()

  const handleClick = () => {
    setIsCollapsed(!isCollapsed)
  }

  const openMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  const isProd = process.env.NODE_ENV === 'production'

  return (
    <>
      <div className={styles.mobileNav}>
        <a
          href={isProd ? 'https://workpace.io/' : 'http://localhost:3000/'}
          className={styles.logoName}
        >
          <Image src={Logo} alt="Logo" className={styles.logo} />
          <h1 className={cn(styles.brandName, { [styles.hide]: isCollapsed })}>{getAppName()}</h1>
        </a>
        <a onClick={openMobileNav}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="#ffffff"
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
                      <a className={styles.links} href={path} key={path}>
                        {name}
                      </a>
                    )
                  })}
              </div>
            </div>
            <div className={styles.headingAndLinks}>
              <div className={styles.linksHeading}>Learn More</div>
              <div className={styles.links}>
                <a href={Routes.ABOUT} className={styles.links}>
                  👋 About Us
                </a>
                <a href={Routes.PROFILE} className={styles.links}>
                  👤 My Profile
                </a>
              </div>
            </div>
          </div>
          <div className={styles.authStatus}>
            {status === 'authenticated' ? (
              <div
                title={Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles}
                className={cn(styles.username, {
                  [styles.hide]: isCollapsed,
                })}
              >
                {data?.user?.name}
              </div>
            ) : (
              <>🚫</>
            )}
            {status === 'authenticated' ? (
              <button
                onClick={signOut}
                className={cn(styles.button, { [styles.hide]: isCollapsed })}
              >
                Sign out
              </button>
            ) : (
              <button
                className={cn({ [styles.hide]: isCollapsed })}
                onClick={() => (window.location.href = '/signin')}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
        <a onClick={openMobileNav} className={styles.mobileIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="#ffffff"
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
              <a
                className={styles.logoName}
                href={isProd ? 'https://workpace.io/' : 'http://localhost:3000/'}
              >
                <Image src={Logo} alt="Logo" className={styles.logo} />
                <h1 className={cn(styles.brandName, { [styles.hide]: isCollapsed })}>
                  {getAppName()}
                </h1>
              </a>
              <div className={styles.collapse} onClick={handleClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#ffffff"
                  viewBox="0 0 256 256"
                >
                  <path d="M197.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L123.31,128ZM72,40a8,8,0,0,0-8,8V208a8,8,0,0,0,16,0V48A8,8,0,0,0,72,40Z"></path>
                </svg>
              </div>
            </>
          )}
        </div>
        <div className={cn(styles.linkStack)}>
          <div className={cn(styles.linksHeading, { [styles.hide]: isCollapsed })}>Prototypes</div>
          {!isCollapsed &&
            prototypes &&
            prototypes.map(({ path, name }: Prototype) => {
              return (
                <a className={styles.links} href={path} key={path}>
                  {name}
                </a>
              )
            })}
          <div className={cn(styles.iconLinkStack)}>
            {isCollapsed && (
              <>
                <a className={styles.iconLinks} href={Routes.HOME}>
                  🏠
                </a>
                {/* <a href={Routes.ABOUT} className={styles.links}>
                  👋
                </a>
                <a href={Routes.PROFILE} className={styles.links}>
                  👤
                </a> */}
              </>
            )}
            {isCollapsed &&
              prototypes &&
              prototypes.map(({ path, name, icon }: Prototype) => {
                return (
                  <a className={styles.links} href={path} title={name} key={path}>
                    {icon}
                  </a>
                )
              })}
          </div>
        </div>
        <div className={cn(styles.divider, { [styles.hide]: isCollapsed })} />
        {/* <div className={cn(styles.linkStack, { [styles.hide]: isCollapsed })}>
          <div className={styles.linksHeading}>Learn More</div>
          <a href={Routes.ABOUT} className={styles.links}>
            👋 About Us
          </a>
          <a href={Routes.PROFILE} className={styles.links}>
            👤 My Profile
          </a>
        </div> */}
        <div className={cn(styles.authStatus, { [styles.hide]: isCollapsed })}>
          {status === 'authenticated' ? (
            <div
              title={Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles}
              className={cn(styles.username, {
                [styles.hide]: isCollapsed,
              })}
            >
              {data?.user?.name}
            </div>
          ) : (
            <>🚫</>
          )}
          {status === 'authenticated' ? (
            <button onClick={signOut} className={cn(styles.button, { [styles.hide]: isCollapsed })}>
              Sign out
            </button>
          ) : (
            <button
              className={cn({ [styles.hide]: isCollapsed })}
              onClick={() => (window.location.href = '/signin')}
            >
              Sign In
            </button>
          )}
        </div>
        {isCollapsed && (
          <div
            /* href={Routes.PROFILE} */
            className={styles.profile}
            title={Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles}
          >
            {data?.user?.name?.[0].toUpperCase() ?? 'N/A'}
          </div>
        )}
      </div>
    </>
  )
}
