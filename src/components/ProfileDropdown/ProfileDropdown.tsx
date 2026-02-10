import { useState, useRef, useEffect } from 'react'

import { Button } from '@workpace/design-system'
import cn from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useUser } from '@/hooks'
import { Routes } from '@/interfaces/routes'
import { UserGroup } from '@/interfaces/user'

import styles from './ProfileDropdown.module.scss'

// Type assertion workaround for Button component type issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ButtonComponent = Button as any

interface ProfileDropdownProps {
  userName: string
  className?: string
}

export const ProfileDropdown = ({ userName, className }: ProfileDropdownProps) => {
  const { user, signOut } = useUser()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.roles?.includes(UserGroup.Admin) ?? false

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleProfileClick = () => {
    router.push(Routes.PROFILE)
    setIsOpen(false)
  }

  const handleAdminClick = () => {
    router.push(Routes.ADMIN)
    setIsOpen(false)
  }

  const handleSignOut = () => {
    signOut()
    setIsOpen(false)
  }

  return (
    <div className={cn(styles.dropdownContainer, className)} ref={dropdownRef}>
      <ButtonComponent
        onClick={() => setIsOpen(!isOpen)}
        variant="default-secondary"
        className={styles.profileButton}
      >
        <span className={styles.buttonContent}>
          <span className={styles.buttonText}>Account</span>
          <svg
            className={cn(styles.arrowIcon, { [styles.arrowIconOpen]: isOpen })}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </span>
      </ButtonComponent>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={handleProfileClick} className={styles.menuItem}>
            Profile
          </button>
          {isAdmin && (
            <button onClick={handleAdminClick} className={styles.menuItem}>
              Admin
            </button>
          )}
          <div className={styles.divider} />
          <button onClick={handleSignOut} className={styles.menuItem}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
