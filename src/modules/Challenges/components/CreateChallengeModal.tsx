import { useFriends, useGoals, useManualFetch } from '@/hooks'
import { CreateChallengeInput, CreateChallengeInvitationInput } from '@/interfaces/challenges'
import { Box, Button, InputField, Select, Text } from '@workpace/design-system'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './CreateChallengeModal.module.scss'

interface CreateChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateChallengeModal = ({ isOpen, onClose, onSuccess }: CreateChallengeModalProps) => {
  const { goals, isLoading: goalsLoading, refetch: refetchGoals } = useGoals()
  const { friends, isLoading: friendsLoading, refetch: refetchFriends } = useFriends()
  const createChallenge = useManualFetch<{ data: { challenge: any } }>('good-stuff-list/challenges')
  const createInvitation = useManualFetch<{ data: { invitation: any } }>(
    'good-stuff-list/challenges/invitations'
  )
  const createGoal = useManualFetch<{ data: { goal: { id: string; name: string } } }>(
    'good-stuff-list/goals'
  )

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [goalId, setGoalId] = useState('')
  const [newGoalName, setNewGoalName] = useState('')
  const [showNewGoalInput, setShowNewGoalInput] = useState(false)
  const [durationDays, setDurationDays] = useState(30)
  const [taskDescription, setTaskDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set())
  const [friendSearchQuery, setFriendSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCreatingGoal, setIsCreatingGoal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      refetchGoals()
      refetchFriends()
      // Set default start date to today
      const today = new Date()
      setStartDate(today.toISOString().split('T')[0])
    } else {
      // Reset form when modal closes
      setName('')
      setDescription('')
      setGoalId('')
      setNewGoalName('')
      setShowNewGoalInput(false)
      setDurationDays(30)
      setTaskDescription('')
      setSelectedFriends(new Set())
      setFriendSearchQuery('')
      setError(null)
    }
  }, [isOpen, refetchGoals, refetchFriends])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const calculateEndDate = (start: string, days: number): string => {
    const date = new Date(start)
    date.setDate(date.getDate() + days - 1) // -1 because start date counts as day 1
    return date.toISOString().split('T')[0]
  }

  const handleDurationChange = (value: string) => {
    const days = parseInt(value, 10)
    setDurationDays(days)
  }

  const handleAddFriend = (friendId: string) => {
    setSelectedFriends((prev) => {
      const next = new Set(prev)
      next.add(friendId)
      return next
    })
  }

  const handleRemoveFriend = (friendId: string) => {
    setSelectedFriends((prev) => {
      const next = new Set(prev)
      next.delete(friendId)
      return next
    })
  }

  const handleCreateGoal = async () => {
    if (!newGoalName.trim()) {
      setError('Goal name is required')
      return
    }

    setIsCreatingGoal(true)
    setError(null)

    try {
      const [response, error] = await createGoal({
        method: 'post',
        data: { name: newGoalName.trim() },
      })

      if (error) throw error

      if (response?.data?.goal) {
        await refetchGoals()
        setGoalId(response.data.goal.id)
        setNewGoalName('')
        setShowNewGoalInput(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create goal')
    } finally {
      setIsCreatingGoal(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Challenge name is required')
      return
    }

    if (!goalId) {
      setError('Please select a goal')
      return
    }

    if (!taskDescription.trim()) {
      setError('Task description is required')
      return
    }

    if (!startDate) {
      setError('Start date is required')
      return
    }

    setIsSubmitting(true)

    try {
      const endDate = calculateEndDate(startDate, durationDays)

      const challengeInput: CreateChallengeInput = {
        goal_id: goalId,
        name: name.trim(),
        description: description.trim() || null,
        duration_days: durationDays,
        task_description: taskDescription.trim(),
        start_date: startDate,
        end_date: endDate,
      }

      const [challengeResult, challengeError] = await createChallenge({
        method: 'post',
        data: challengeInput,
      })

      if (challengeError) {
        throw challengeError
      }

      if (!challengeResult?.data?.challenge) {
        throw new Error('Failed to create challenge')
      }

      const challengeId = challengeResult.data.challenge.id

      // Send invitations to selected friends
      if (selectedFriends.size > 0) {
        const invitationPromises = Array.from(selectedFriends).map((friendId) =>
          createInvitation({
            method: 'post',
            data: {
              challenge_id: challengeId,
              invitee_user_id: friendId,
            } as CreateChallengeInvitationInput,
          })
        )

        await Promise.all(invitationPromises)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to create challenge')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <Text variant="headline-md-emphasis">Create Challenge</Text>
          <Button variant="default-secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {error && (
            <Box
              marginBottom={200}
              padding={200}
              style={{ background: '#fee', borderRadius: '8px' }}
            >
              <Text variant="body-md" color="error-700">
                {error}
              </Text>
            </Box>
          )}

          <InputField
            label="Challenge Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            marginBottom={200}
          />

          <InputField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            marginBottom={200}
          />

          <Box marginBottom={200}>
            <Select
              label="Goal"
              value={goalId}
              onChange={(e) => {
                setGoalId(e.target.value)
                setShowNewGoalInput(false)
              }}
              required
              disabled={goalsLoading}
            >
              <option value="">Select a goal</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </Select>
            <Box marginTop={100}>
              <Button
                variant="default-secondary"
                type="button"
                onClick={() => {
                  setShowNewGoalInput(!showNewGoalInput)
                  setNewGoalName('')
                  if (showNewGoalInput) {
                    setGoalId('')
                  }
                }}
                disabled={isCreatingGoal}
              >
                {showNewGoalInput ? 'Cancel' : '+ Create New Goal'}
              </Button>
            </Box>
            {showNewGoalInput && (
              <Box marginTop={150} className={styles.newGoalInputRow}>
                <Box className={styles.newGoalInputField}>
                  <InputField
                    label="New Goal Name"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    placeholder="Enter goal name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCreateGoal()
                      }
                    }}
                    disabled={isCreatingGoal}
                  />
                </Box>
                <Button
                  variant="brand-primary"
                  type="button"
                  onClick={handleCreateGoal}
                  disabled={isCreatingGoal || !newGoalName.trim()}
                >
                  {isCreatingGoal ? 'Creating...' : 'Create'}
                </Button>
              </Box>
            )}
          </Box>

          <InputField
            label="Duration (days)"
            type="number"
            value={durationDays.toString()}
            onChange={(e) => handleDurationChange(e.target.value)}
            required
            min={1}
            marginBottom={200}
          />

          <InputField
            label="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe the daily task you'll complete..."
            required
            marginBottom={200}
          />

          <InputField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            marginBottom={200}
          />

          {startDate && durationDays > 0 && (
            <Box marginBottom={200}>
              <Text variant="body-sm" color="neutral-600">
                End Date: {calculateEndDate(startDate, durationDays)}
              </Text>
            </Box>
          )}

          {friends.length > 0 && (
            <Box marginBottom={200}>
              <Text variant="body-md-emphasis" marginBottom={300}>
                Invite Friends (optional)
              </Text>
              <Box marginTop={200}>
                <InputField
                  label="Search friends"
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  placeholder="Search by email or name..."
                  marginBottom={150}
                />
              </Box>
              {selectedFriends.size > 0 && (
                <Box marginBottom={150}>
                  <Text variant="body-sm-emphasis" marginBottom={100}>
                    Added Friends ({selectedFriends.size})
                  </Text>
                  <div className={styles.addedFriendsList}>
                    {friends
                      .filter((friend: any) => {
                        const friendId = friend.friend_id || friend.id
                        return selectedFriends.has(friendId)
                      })
                      .map((friend: any) => {
                        const friendId = friend.friend_id || friend.id
                        const friendEmail =
                          friend.friend?.email || friend.friend_email || friend.email
                        const friendName = friend.friend?.name || friend.friend_name || friend.name
                        const displayName = friendName || friendEmail

                        return (
                          <div key={friendId} className={styles.addedFriendItem}>
                            <Text variant="body-sm">{displayName}</Text>
                            <Button
                              variant="default-secondary"
                              type="button"
                              onClick={() => handleRemoveFriend(friendId)}
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      })}
                  </div>
                </Box>
              )}
              <div className={styles.friendsList}>
                {friends
                  .filter((friend: any) => {
                    const friendId = friend.friend_id || friend.id
                    // Don't show already added friends in search results
                    if (selectedFriends.has(friendId)) return false

                    // If no search query, show all friends
                    if (!friendSearchQuery.trim()) return true

                    // Otherwise filter by search query
                    const searchLower = friendSearchQuery.toLowerCase()
                    const friendEmail = (
                      friend.friend?.email ||
                      friend.friend_email ||
                      friend.email ||
                      ''
                    ).toLowerCase()
                    const friendName = (
                      friend.friend?.name ||
                      friend.friend_name ||
                      friend.name ||
                      ''
                    ).toLowerCase()
                    return friendEmail.includes(searchLower) || friendName.includes(searchLower)
                  })
                  .map((friend: any) => {
                    const friendId = friend.friend_id || friend.id
                    const friendEmail = friend.friend?.email || friend.friend_email || friend.email
                    const friendName = friend.friend?.name || friend.friend_name || friend.name
                    const displayName = friendName || friendEmail

                    return (
                      <div key={friendId} className={styles.friendItem}>
                        <Text variant="body-sm">{displayName}</Text>
                        <Button
                          variant="brand-primary"
                          type="button"
                          onClick={() => handleAddFriend(friendId)}
                        >
                          Add
                        </Button>
                      </div>
                    )
                  })}
                {friends.filter((friend: any) => {
                  const friendId = friend.friend_id || friend.id
                  if (selectedFriends.has(friendId)) return false
                  if (!friendSearchQuery.trim()) return true
                  const searchLower = friendSearchQuery.toLowerCase()
                  const friendEmail = (
                    friend.friend?.email ||
                    friend.friend_email ||
                    friend.email ||
                    ''
                  ).toLowerCase()
                  const friendName = (
                    friend.friend?.name ||
                    friend.friend_name ||
                    friend.name ||
                    ''
                  ).toLowerCase()
                  return friendEmail.includes(searchLower) || friendName.includes(searchLower)
                }).length === 0 &&
                  friendSearchQuery.trim() && (
                    <Text variant="body-sm" color="neutral-600" style={{ padding: '12px' }}>
                      No friends found matching &quot;{friendSearchQuery}&quot;
                    </Text>
                  )}
                {!friendSearchQuery.trim() &&
                  friends.filter((f: any) => {
                    const friendId = f.friend_id || f.id
                    return !selectedFriends.has(friendId)
                  }).length === 0 && (
                    <Text variant="body-sm" color="neutral-600" style={{ padding: '12px' }}>
                      All friends have been added
                    </Text>
                  )}
              </div>
            </Box>
          )}

          <div className={styles.modalActions}>
            <Button variant="default-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="brand-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Challenge'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}
