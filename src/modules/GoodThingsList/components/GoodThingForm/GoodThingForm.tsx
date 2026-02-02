import { useGoals, useGoodThings, useManualFetch } from '@/hooks'
import { CreateGoodThingInput, GoodThing, UpdateGoodThingInput } from '@/interfaces/good-things'
import { Button, InputField, Select, Text } from '@workpace/design-system'
import { useEffect, useState } from 'react'
import styles from './GoodThingForm.module.scss'

interface GoodThingFormProps {
  goodThing?: GoodThing | null
  onSuccess?: () => void
  onCancel?: () => void
}

export const GoodThingForm = ({ goodThing, onSuccess, onCancel }: GoodThingFormProps) => {
  const { goals, isLoading: goalsLoading, refetch: refetchGoals } = useGoals()
  const { refetch: refetchGoodThings } = useGoodThings()
  const createGoodThing = useManualFetch<{ data: { good_thing: GoodThing } }>('good-stuff-list/good-things')
  const updateGoodThing = useManualFetch<{ data: { good_thing: GoodThing } }>(`good-stuff-list/good-things/${goodThing?.id || ''}`)

  const [title, setTitle] = useState(goodThing?.title || '')
  const [description, setDescription] = useState(goodThing?.description || '')
  const [goalId, setGoalId] = useState<string>(goodThing?.goal_id || '')
  const [completionDate, setCompletionDate] = useState(
    goodThing?.completion_date ? goodThing.completion_date.split('T')[0] : ''
  )
  const [newGoalName, setNewGoalName] = useState('')
  const [showNewGoalInput, setShowNewGoalInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    refetchGoals()
  }, [])

  const createGoal = useManualFetch<{ data: { goal: { id: string } } }>('good-stuff-list/goals')

  const handleCreateGoal = async () => {
    if (!newGoalName.trim()) {
      setError('Goal name is required')
      return
    }

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
        setError(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create goal')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsSubmitting(true)

    try {
      const input: CreateGoodThingInput | UpdateGoodThingInput = {
        title: title.trim(),
        description: description.trim() || null,
        goal_id: goalId || null,
        completion_date: completionDate || null,
      }

      if (goodThing) {
        const [response, error] = await updateGoodThing({
          method: 'put',
          data: input,
        })
        if (error) throw error
      } else {
        const [response, error] = await createGoodThing({
          method: 'post',
          data: input,
        })
        if (error) throw error
      }

      await refetchGoodThings()
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message || `Failed to ${goodThing ? 'update' : 'create'} good thing`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <Text variant="headline-md-emphasis">
          {goodThing ? 'Edit Good Thing' : 'Add Good Thing'}
        </Text>
      </div>

      {error && (
        <div className={styles.error}>
          <Text variant="body-md" color="urgent-600">
            {error}
          </Text>
        </div>
      )}

      <InputField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        marginBottom={200}
      />

      <div className={styles.textareaContainer}>
        <label className={styles.label}>
          <Text variant="body-md">Description</Text>
        </label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you accomplished..."
          rows={4}
        />
      </div>

      <div className={styles.goalSection}>
        <Select
          label="Goal"
          value={goalId}
          onChange={(e) => {
            if (e.target.value === '__new__') {
              setShowNewGoalInput(true)
              setGoalId('')
            } else {
              setGoalId(e.target.value)
              setShowNewGoalInput(false)
            }
          }}
          placeholder="Select a goal (optional)"
          marginBottom={showNewGoalInput ? 200 : undefined}
        >
          <option value="">No goal</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
          <option value="__new__">+ Create New Goal</option>
        </Select>

        {showNewGoalInput && (
          <div className={styles.newGoalInput}>
            <InputField
              label="New Goal Name"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              marginBottom={200}
            />
            <div className={styles.newGoalActions}>
              <Button
                type="button"
                variant="default-secondary"
                onClick={handleCreateGoal}
                disabled={!newGoalName.trim()}
              >
                Create Goal
              </Button>
              <Button
                type="button"
                variant="default-secondary"
                onClick={() => {
                  setShowNewGoalInput(false)
                  setNewGoalName('')
                  setGoalId('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <InputField
        label="Completion Date"
        type="date"
        value={completionDate}
        onChange={(e) => setCompletionDate(e.target.value)}
        marginBottom={200}
      />

      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="brand-primary"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? 'Saving...' : goodThing ? 'Update' : 'Add'}
        </Button>
        {onCancel && (
          <Button type="button" variant="default-secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
