import { GetServerSideProps } from 'next'

import {
  useAddFriend,
  useFriends,
  useRemoveFriend,
  useSearchUsers,
} from '@/hooks/useFriends/useFriends'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'
import { Box, Button, InputField, Loading, Text } from '@workpace/design-system'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './friends.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const FriendsPage = () => {
  const { friends, isLoading: isLoadingFriends, error: friendsError, refetch } = useFriends()
  const searchUsers = useSearchUsers()
  const addFriend = useAddFriend()
  const removeFriend = useRemoveFriend()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState<string | null>(null)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load friends on mount
  useEffect(() => {
    refetch()
  }, [refetch])

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

  const handleAddFriend = useCallback(
    async (friendId: string) => {
      setIsAdding(friendId)
      setSearchError(null)

      try {
        const [response, error] = await addFriend({
          method: 'post',
          data: { friend_id: friendId },
        })

        if (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add friend'
          setSearchError(errorMessage)
        } else {
          // Clear search and refresh friends list
          setSearchQuery('')
          setSearchResults([])
          setShowDropdown(false)
          await refetch()
        }
      } catch (err) {
        setSearchError('Failed to add friend')
      } finally {
        setIsAdding(null)
      }
    },
    [addFriend, refetch]
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

  // Check if a user is already a friend
  const isAlreadyFriend = (userId: string) => {
    return friends.some((f) => f.friend_id === userId)
  }

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
                          ) : (
                            <Button
                              variant="brand-primary"
                              onClick={() => handleAddFriend(user.id)}
                              disabled={isAddingThis}
                            >
                              {isAddingThis ? 'Adding...' : 'Add'}
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

        {/* Friends Table */}
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
        )}
      </div>
    </>
  )
}

export default FriendsPage
