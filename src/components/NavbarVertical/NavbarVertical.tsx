import { useState } from 'react'

import cn from 'classnames'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

import { Prototype } from '@/interfaces/prototypes'
import { Routes } from '@/interfaces/routes'
import { usePrototypesContext } from '@/modules'
import Logo from '@/public/favicon.ico'
import { getAppName } from '@/utils'

import styles from './NavbarVertical.module.scss'

const NavbarVertical = () => {
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: Routes.SIGNIN })
  }
  const { data, status } = useSession()

  const isProd = process.env.NODE_ENV === 'production'

  const {
    state: { prototypes },
  } = usePrototypesContext()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const handleClick = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
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
            <h1 className={cn(styles.brandName, { [styles.hide]: isCollapsed })}>{getAppName()}</h1>
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
              {'<'}
            </div>
          </>
        )}
      </div>
      <div className={cn(styles.linkStack)}>
        <div className={cn(styles.linksHeading, { [styles.hide]: isCollapsed })}>Prototypes</div>
        {!isCollapsed &&
          prototypes.map(({ path, name }: Prototype) => {
            return (
              <a className={styles.links} href={path} key={path}>
                {name}
              </a>
            )
          })}
        <div className={cn(styles.iconLinkStack)}>
          {isCollapsed && (
            <a className={styles.iconLinks} href={Routes.HOME}>
              🏠
            </a>
          )}
          {isCollapsed &&
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
      <div className={cn(styles.linkStack, { [styles.hide]: isCollapsed })}>
        <div className={styles.linksHeading}>Learn More</div>
        <a href={Routes.ABOUT} className={styles.links}>
          👋 About Us
        </a>
        <a href={Routes.PROFILE} className={styles.links}>
          👤 My Profile
        </a>
      </div>
      <div className={cn(styles.authStatus, { [styles.hide]: isCollapsed })}>
        {status === 'authenticated' ? (
          <div
            /* title={data?.user?.roles} */ className={cn(styles.username, {
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
            onClick={handleSignOut}
            className={cn(styles.button, { [styles.hide]: isCollapsed })}
          >
            Sign out
          </button>
        ) : (
          <button
            className={cn({ [styles.hide]: isCollapsed })}
            onClick={() => (window.location.href = '/login')}
          >
            Sign In
          </button>
        )}
      </div>
      {isCollapsed && (
        <div className={styles.profile} /* title={data?.user?.roles} */>
          {data?.user?.name?.[0].toUpperCase() ?? 'N/A'}
        </div>
      )}
    </div>
  )
}

export default NavbarVertical
