import { GetServerSideProps } from 'next'

import {
  useFriendInvitations,
  useFriends,
  useRemoveFriend,
  useSearchUsers,
  useSendFriendRequest,
  useUpdateFriendInvitation,
} from '@/hooks/useFriends/useFriends'
import { useSupabaseSession } from '@/hooks/useSupabaseSession'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'
import { Box, Button, Card, InputField, Loading, Text } from '@workpace/design-system'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './friends.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const FriendsPage = () => {
  const { user } = useSupabaseSession()
  const currentUserId = user?.id
  const { friends, isLoading: isLoadingFriends, error: friendsError, refetch } = useFriends()
  const {
    invitations,
    isLoading: isLoadingInvitations,
    error: invitationsError,
    refetch: refetchInvitations,
  } = useFriendInvitations()
  const searchUsers = useSearchUsers()
  const sendFriendRequest = useSendFriendRequest()
  const updateFriendInvitation = useUpdateFriendInvitation()
  const removeFriend = useRemoveFriend()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load friends and invitations on mount
  useEffect(() => {
    refetch()
    refetchInvitations()
  }, [refetch, refetchInvitations])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      setShowDropdown(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      setSearchError(null)
      setShowDropdown(true)

      try {
        const [response, error] = await searchUsers({
          method: 'get',
          params: { q: searchQuery.trim() },
        })

        if (error) {
          setSearchError('Failed to search users')
          setSearchResults([])
        } else {
          setSearchResults(response?.data?.users ?? [])
        }
      } catch (err) {
        setSearchError('Failed to search users')
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchUsers])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showDropdown])

  const handleSendFriendRequest = useCallback(
    async (friendId: string) => {
      setIsAdding(friendId)
      setSearchError(null)

      try {
        const [response, error] = await sendFriendRequest({
          method: 'post',
          data: { invitee_user_id: friendId },
        })

        if (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to send friend request'
          setSearchError(errorMessage)
        } else {
          // Clear search and refresh invitations list
          setSearchQuery('')
          setSearchResults([])
          setShowDropdown(false)
          await refetchInvitations()
        }
      } catch (err) {
        setSearchError('Failed to send friend request')
      } finally {
        setIsAdding(null)
      }
    },
    [sendFriendRequest, refetchInvitations]
  )

  const handleRemoveFriend = useCallback(
    async (friendId: string) => {
      setIsRemoving(friendId)

      try {
        const [response, error] = await removeFriend({
          method: 'delete',
          url: `friends/${friendId}`,
        })

        if (!error) {
          await refetch()
        }
      } catch (err) {
        // Error handling
      } finally {
        setIsRemoving(null)
      }
    },
    [removeFriend, refetch]
  )

  const handleAcceptInvitation = useCallback(
    async (invitationId: string) => {
      try {
        const [response, error] = await updateFriendInvitation({
          method: 'patch',
          url: `friends/invitations/${invitationId}`,
          data: { status: 'accepted' },
        })

        if (!error) {
          await refetchInvitations()
          await refetch()
        }
      } catch (err) {
        // Error handling
      }
    },
    [updateFriendInvitation, refetchInvitations, refetch]
  )

  const handleDeclineInvitation = useCallback(
    async (invitationId: string) => {
      try {
        const [response, error] = await updateFriendInvitation({
          method: 'patch',
          url: `friends/invitations/${invitationId}`,
          data: { status: 'declined' },
        })

        if (!error) {
          await refetchInvitations()
        }
      } catch (err) {
        // Error handling
      }
    },
    [updateFriendInvitation, refetchInvitations]
  )

  // Check if a user is already a friend
  const isAlreadyFriend = (userId: string) => {
    return friends.some((f) => f.friend_id === userId)
  }

  // Check if there's a pending invitation (either sent or received)
  const hasPendingInvitation = (userId: string) => {
    return invitations.some(
      (inv) =>
        (inv.inviter_user_id === userId || inv.invitee_user_id === userId) &&
        inv.status === 'pending'
    )
  }

  // Group friends alphabetically for mobile contacts-style list
  const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
    if (name) {
      const parts = name.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name[0]?.toUpperCase() || '?'
    }
    if (email) {
      return email[0]?.toUpperCase() || '?'
    }
    return '?'
  }

  const getDisplayName = (friend: any) => {
    const friendUser = friend.friend
    return friendUser?.name || friendUser?.email || 'Unknown User'
  }

  const getDisplayEmail = (friend: any) => {
    return friend.friend?.email || null
  }

  const groupedFriends = friends.reduce((acc, friend) => {
    const displayName = getDisplayName(friend)
    const firstLetter = displayName[0]?.toUpperCase() || '#'
    const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#'

    if (!acc[letter]) {
      acc[letter] = []
    }
    acc[letter].push(friend)
    return acc
  }, {} as Record<string, typeof friends>)

  // Sort each group and get sorted letters
  const sortedLetters = Object.keys(groupedFriends).sort()
  sortedLetters.forEach((letter) => {
    groupedFriends[letter].sort((a: typeof friends[0], b: typeof friends[0]) => {
      const nameA = getDisplayName(a).toLowerCase()
      const nameB = getDisplayName(b).toLowerCase()
      return nameA.localeCompare(nameB)
    })
  })

  return (
    <>
      <DocumentTitle title="Friends" />
      <PageHeader
        title="Friends"
        subtitle="Connect with other WorkPace users and build your network"
      />

      <div className={styles.container}>
        {/* Search Bar with Typeahead */}
        <div className={styles.searchSection} ref={searchRef}>
          <InputField
            label="Search for friends"
            placeholder="Enter email, name, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim() && searchResults.length > 0) {
                setShowDropdown(true)
              }
            }}
            helperText={
              searchQuery.trim() ? undefined : 'Start typing to search for users to add as friends'
            }
          />

          {searchError && (
            <Box marginTop={150}>
              <Text variant="body-sm" color="error-600">
                {searchError}
              </Text>
            </Box>
          )}

          {/* Typeahead Dropdown */}
          {showDropdown && searchQuery.trim() && (
            <div className={styles.typeaheadDropdown}>
              {isSearching ? (
                <div className={styles.dropdownLoading}>
                  <Loading />
                </div>
              ) : searchResults.length > 0 ? (
                <div className={styles.dropdownList}>
                  {searchResults.map((user) => {
                    const alreadyFriend = isAlreadyFriend(user.id)
                    const isAddingThis = isAdding === user.id

                    return (
                      <div key={user.id} className={styles.dropdownItem}>
                        <div className={styles.dropdownItemInfo}>
                          <Text variant="body-md-emphasis">
                            {user.name || user.email || 'Unknown User'}
                          </Text>
                          {user.email && (
                            <Text variant="body-sm" color="neutral-600" marginTop={50}>
                              {user.email}
                            </Text>
                          )}
                        </div>
                        <div className={styles.dropdownItemAction}>
                          {alreadyFriend ? (
                            <Text variant="body-sm" color="neutral-400">
                              Already friends
                            </Text>
                          ) : hasPendingInvitation(user.id) ? (
                            <Text variant="body-sm" color="neutral-400">
                              Request pending
                            </Text>
                          ) : (
                            <Button
                              variant="brand-primary"
                              onClick={() => handleSendFriendRequest(user.id)}
                              disabled={isAddingThis}
                            >
                              {isAddingThis ? 'Sending...' : 'Send Request'}
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className={styles.dropdownEmpty}>
                  <Text variant="body-sm" color="neutral-600">
                    No users found
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card marginBottom={300}>
            <Box padding={300}>
              <Text variant="headline-md-emphasis" marginBottom={200}>
                Pending Friend Requests
              </Text>
              <div className={styles.invitationsList}>
                {invitations.map((invitation) => {
                  const isInviter = currentUserId === invitation.inviter_user_id
                  const otherUserName = isInviter
                    ? invitation.invitee_name || invitation.invitee_email || 'Unknown User'
                    : invitation.inviter_name || invitation.inviter_email || 'Unknown User'
                  const otherUserEmail = isInviter
                    ? invitation.invitee_email
                    : invitation.inviter_email

                  return (
                    <div key={invitation.id} className={styles.invitationItem}>
                      <div className={styles.invitationInfo}>
                        <Text variant="body-md-emphasis">{otherUserName}</Text>
                        {otherUserEmail && (
                          <Text variant="body-sm" color="neutral-600" marginTop={50}>
                            {otherUserEmail}
                          </Text>
                        )}
                        {isInviter && (
                          <Text variant="body-sm" color="neutral-600" marginTop={50}>
                            Request sent
                          </Text>
                        )}
                      </div>
                      {!isInviter && (
                        <div className={styles.invitationActions}>
                          <Button
                            variant="brand-primary"
                            onClick={() => handleAcceptInvitation(invitation.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="default-secondary"
                            onClick={() => handleDeclineInvitation(invitation.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Box>
          </Card>
        )}

        {/* Friends List - Mobile Contacts Style */}
        {isLoadingFriends ? (
          <div className={styles.loading}>
            <Loading />
          </div>
        ) : friendsError ? (
          <div className={styles.error}>
            <Text variant="body-md" color="error-600" marginBottom={100}>
              Failed to load friends
            </Text>
            <Text variant="body-sm" color="neutral-600">
              {friendsError instanceof Error
                ? friendsError.message
                : 'Please make sure the database migration has been run.'}
            </Text>
          </div>
        ) : friends.length === 0 ? (
          <div className={styles.empty}>
            <Text variant="body-md" color="neutral-600">
              You haven&apos;t added any friends yet. Search above to get started!
            </Text>
          </div>
        ) : (
          <>
            {/* Mobile Contacts List */}
            <div className={styles.mobileFriendsList}>
              {sortedLetters.map((letter) => (
                <div key={letter} className={styles.friendsSection}>
                  <div className={styles.sectionHeader}>{letter}</div>
                  {groupedFriends[letter].map((friend: typeof friends[0]) => {
                    const isRemovingThis = isRemoving === friend.friend_id
                    const displayName = getDisplayName(friend)
                    const displayEmail = getDisplayEmail(friend)
                    const initials = getInitials(
                      friend.friend?.name,
                      friend.friend?.email
                    )

                    return (
                      <div key={friend.id} className={styles.friendItem}>
                        <div className={styles.friendAvatar}>
                          <span className={styles.avatarText}>{initials}</span>
                        </div>
                        <div className={styles.friendInfo}>
                          <Text variant="body-md-emphasis">{displayName}</Text>
                          {displayEmail && (
                            <Text variant="body-sm" color="neutral-600" marginTop={50}>
                              {displayEmail}
                            </Text>
                          )}
                        </div>
                        <div className={styles.friendAction}>
                          <Button
                            variant="default-secondary"
                            onClick={() => handleRemoveFriend(friend.friend_id)}
                            disabled={isRemovingThis}
                          >
                            {isRemovingThis ? 'Removing...' : 'Remove'}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Name</th>
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {friends.map((friend) => {
                    const isRemovingThis = isRemoving === friend.friend_id
                    const friendUser = friend.friend

                    return (
                      <tr key={friend.id} className={styles.tr}>
                        <td className={styles.td}>
                          <Text variant="body-md-emphasis">
                            {friendUser?.name || friendUser?.email || 'Unknown User'}
                          </Text>
                          {(friendUser?.given_name || friendUser?.family_name) && (
                            <Text variant="body-sm" color="neutral-600" marginTop={50}>
                              {[friendUser.given_name, friendUser.family_name]
                                .filter(Boolean)
                                .join(' ')}
                            </Text>
                          )}
                        </td>
                        <td className={styles.td}>
                          <Text variant="body-sm" color="neutral-600">
                            {friendUser?.email || '—'}
                          </Text>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.actions}>
                            <Button
                              variant="default-secondary"
                              onClick={() => handleRemoveFriend(friend.friend_id)}
                              disabled={isRemovingThis}
                            >
                              {isRemovingThis ? 'Removing...' : 'Remove'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default FriendsPage
