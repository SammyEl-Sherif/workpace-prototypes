import { useState, useEffect } from 'react'

import { Button, Card, InputField, Text } from '@workpace/design-system'

import { useUser } from '@/hooks'
import { UserGroup } from '@/interfaces/user'

import styles from './ProfilePage.module.scss'

interface ProfileData {
  name: string
  email: string
  phone?: string
  given_name?: string
  family_name?: string
}

export const ProfilePage = () => {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    given_name: '',
    family_name: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            given_name: data.given_name || '',
            family_name: data.family_name || '',
          })
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      // Update local state with the response data
      const updatedData = await response.json()
      setProfileData({
        name: updatedData.name || '',
        email: updatedData.email || '',
        phone: updatedData.phone || '',
        given_name: updatedData.given_name || '',
        family_name: updatedData.family_name || '',
      })

      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    // Reset to original values by refetching
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          given_name: data.given_name || '',
          family_name: data.family_name || '',
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
    setIsEditing(false)
    setError(null)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <Text variant="headline-lg" className={styles.title}>
              My Profile
            </Text>
          </div>

          <div className={styles.profileForm}>
            <InputField
              label="Name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={!isEditing}
              required
            />

            <InputField
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!isEditing}
              required
            />

            <InputField
              label="Phone Number"
              type="tel"
              value={profileData.phone || ''}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!isEditing}
            />

            <InputField
              label="First Name"
              value={profileData.given_name || ''}
              onChange={(e) => setProfileData({ ...profileData, given_name: e.target.value })}
              disabled={!isEditing}
            />

            <InputField
              label="Last Name"
              value={profileData.family_name || ''}
              onChange={(e) => setProfileData({ ...profileData, family_name: e.target.value })}
              disabled={!isEditing}
            />

            {error && (
              <div className={styles.errorMessage}>
                <Text variant="body-md" color="error-700">
                  {error}
                </Text>
              </div>
            )}

            <div className={styles.actions}>
              {isEditing ? (
                <>
                  <Button
                    variant="brand-secondary"
                    onClick={handleSave}
                    disabled={isLoading}
                    className={styles.submitButton}
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="default-secondary"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className={styles.submitButton}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="brand-secondary"
                  onClick={() => setIsEditing(true)}
                  className={styles.submitButton}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className={styles.roles}>
            <div className={styles.roleHeading}>User Roles</div>
            {user?.roles && user.roles.length > 0 ? (
              <div className={styles.rolesList}>
                {user.roles.map((role: string) => (
                  <div key={role} className={styles.role}>
                    {role}
                  </div>
                ))}
              </div>
            ) : (
              <Text variant="body-md" color="neutral-600">
                No roles assigned
              </Text>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
