import { useState, useEffect, useRef } from 'react'

import { Button } from '@workpace/design-system'

import { useUser } from '@/hooks'

import styles from './ProfilePage.module.scss'

interface ProfileData {
  name: string
  email: string
  phone?: string
  given_name?: string
  family_name?: string
}

interface EditableFieldProps {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  type?: string
}

const EditableField = ({ label, value, placeholder, onChange, type = 'text' }: EditableFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const handleClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className={styles.field} onClick={handleClick}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        ref={inputRef}
        type={type}
        className={isFocused || value ? styles.fieldInput : styles.fieldInputEmpty}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

export const ProfilePage = () => {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    given_name: '',
    family_name: '',
  })
  const [originalData, setOriginalData] = useState<ProfileData>(profileData)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          const fetched = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            given_name: data.given_name || '',
            family_name: data.family_name || '',
          }
          setProfileData(fetched)
          setOriginalData(fetched)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const updatedData = await response.json()
      const updated = {
        name: updatedData.name || '',
        email: updatedData.email || '',
        phone: updatedData.phone || '',
        given_name: updatedData.given_name || '',
        family_name: updatedData.family_name || '',
      }
      setProfileData(updated)
      setOriginalData(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setError(null)
  }

  const hasChanges =
    profileData.name !== originalData.name ||
    profileData.email !== originalData.email ||
    profileData.phone !== originalData.phone ||
    profileData.given_name !== originalData.given_name ||
    profileData.family_name !== originalData.family_name

  return (
    <div className={styles.container}>
      <div className={styles.fieldRow}>
        <EditableField
          label="First Name"
          value={profileData.given_name || ''}
          placeholder="Add first name"

          onChange={(val) => setProfileData({ ...profileData, given_name: val })}
        />
        <EditableField
          label="Last Name"
          value={profileData.family_name || ''}
          placeholder="Add last name"

          onChange={(val) => setProfileData({ ...profileData, family_name: val })}
        />
      </div>

      <EditableField
        label="Display Name"
        value={profileData.name}
        placeholder="Add display name"

        onChange={(val) => setProfileData({ ...profileData, name: val })}
      />

      <EditableField
        label="Email"
        value={profileData.email}
        placeholder="Add email"

        onChange={(val) => setProfileData({ ...profileData, email: val })}
        type="email"
      />

      <EditableField
        label="Phone"
        value={profileData.phone || ''}
        placeholder="Add phone number"

        onChange={(val) => setProfileData({ ...profileData, phone: val })}
        type="tel"
      />

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.actions}>
        <Button
          variant="brand-secondary"
          onClick={handleSave}
          disabled={isLoading || !hasChanges}
          className={styles.saveButton}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        <button onClick={handleCancel} disabled={isLoading || !hasChanges} className={styles.cancelButton}>
          Cancel
        </button>
      </div>

      {user?.roles && user.roles.length > 0 && (
        <div className={styles.roles}>
          <span className={styles.fieldLabel}>Roles</span>
          <div className={styles.rolesList}>
            {user.roles.map((role: string) => (
              <div key={role} className={styles.role}>
                {role}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
