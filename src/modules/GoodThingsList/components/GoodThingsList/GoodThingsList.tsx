import { useGoodThings, useManualFetch } from '@/hooks'
import { GoodThing, GoodThingMedia } from '@/interfaces/good-things'
import { formatDate } from '@/utils'
import { Badge, Button, Card, CardContent, Loading, Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GoodThingForm } from '../GoodThingForm'
import styles from './GoodThingsList.module.scss'

interface GoodThingsListProps {
  addFormOpen?: boolean
  onAddFormClose?: () => void
  /** Pre-filtered list of good things (e.g. by goal). When provided the component won't fetch its own. */
  goodThings?: GoodThing[]
}

export const GoodThingsList = ({
  addFormOpen,
  onAddFormClose,
  goodThings: goodThingsProp,
}: GoodThingsListProps) => {
  const { goodThings: allGoodThings, isLoading, error, refetch } = useGoodThings()

  // Use the prop when supplied (already filtered), otherwise fall back to our own fetch
  const goodThings = goodThingsProp ?? allGoodThings

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingMedia, setEditingMedia] = useState<GoodThingMedia[]>([])

  const fetchMedia = useManualFetch<{ data: { media: GoodThingMedia[] } }>(
    'good-stuff-list/good-thing-media'
  )

  // Sync external add-form trigger
  useEffect(() => {
    if (addFormOpen) {
      setEditingId(null)
      setShowForm(true)
    }
  }, [addFormOpen])

  useEffect(() => {
    if (!goodThingsProp) {
      refetch()
    }
  }, [])

  // Fetch media when starting to edit a good thing
  const handleStartEdit = async (id: string) => {
    setEditingId(id)
    setShowForm(true)
    setEditingMedia([])

    try {
      const [response] = await fetchMedia({
        method: 'get',
        url: `good-stuff-list/good-thing-media/${id}`,
        params: { goodThingId: id },
      })

      if (response?.data?.media) {
        setEditingMedia(response.data.media)
      }
    } catch {
      // If media fetch fails, continue editing without media
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this good thing?')) return

    try {
      const response = await fetch(`/api/good-stuff-list/good-things/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete good thing')
      }

      await refetch()
    } catch (err: any) {
      alert(err.message || 'Failed to delete good thing')
    }
  }

  if (isLoading && !goodThingsProp) {
    return (
      <div className={styles.loading}>
        <Loading size="md" />
      </div>
    )
  }

  if (error && !goodThingsProp) {
    return (
      <div className={styles.error}>
        <Text color="error-600">Error loading good things: {error.message}</Text>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={styles.formContainer}
        >
          <GoodThingForm
            goodThing={editingId ? goodThings.find((gt) => gt.id === editingId) || null : null}
            existingMedia={editingId ? editingMedia : []}
            onSuccess={() => {
              setShowForm(false)
              setEditingId(null)
              setEditingMedia([])
              onAddFormClose?.()
              refetch()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
              setEditingMedia([])
              onAddFormClose?.()
            }}
          />
        </motion.div>
      )}

      {goodThings.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
          <span className={styles.emptyIcon}>🌟</span>
          <Text variant="headline-sm-emphasis">No good things yet</Text>
          <Text variant="body-md" color="neutral-600">
            Start logging your wins — even the small ones add up!
          </Text>
          <Button
            variant="brand-primary"
            onClick={() => {
              setEditingId(null)
              setShowForm(true)
            }}
          >
            + Add Your First Good Thing
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Desktop: Table view */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Title</th>
                  <th className={styles.th}>Description</th>
                  <th className={styles.th}>Goal</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goodThings.map((goodThing) => (
                  <tr key={goodThing.id} className={styles.tr}>
                    <td className={styles.td}>
                      <Text variant="body-md-emphasis">{goodThing.title}</Text>
                    </td>
                    <td className={styles.td}>
                      <Text variant="body-sm" color="neutral-600">
                        {goodThing.description
                          ? goodThing.description.length > 80
                            ? goodThing.description.substring(0, 80) + '...'
                            : goodThing.description
                          : '—'}
                      </Text>
                    </td>
                    <td className={styles.td}>
                      {goodThing.goal_name ? (
                        <Badge variant="info" size="sm">
                          {goodThing.goal_name}
                        </Badge>
                      ) : (
                        <Text variant="body-sm" color="neutral-400">
                          —
                        </Text>
                      )}
                    </td>
                    <td className={styles.td}>
                      <Text variant="body-sm" color="neutral-600">
                        {formatDate(goodThing.completion_date)}
                      </Text>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actions}>
                        <Button
                          variant="default-secondary"
                          onClick={() => handleStartEdit(goodThing.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="default-secondary"
                          onClick={() => handleDelete(goodThing.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: Card view */}
          <div className={styles.cardList}>
            {goodThings.map((goodThing, index) => (
              <motion.div
                key={goodThing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -2 }}
              >
                <Card className={styles.card}>
                  <CardContent>
                    <div className={styles.cardHeader}>
                      <div>
                        <Text variant="headline-sm-emphasis">{goodThing.title}</Text>
                        {goodThing.goal_name && (
                          <Badge variant="info" size="sm" margin={100}>
                            {goodThing.goal_name}
                          </Badge>
                        )}
                      </div>
                      <div className={styles.cardActions}>
                        <Button
                          variant="default-secondary"
                          onClick={() => handleStartEdit(goodThing.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="default-secondary"
                          onClick={() => handleDelete(goodThing.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    {goodThing.description && (
                      <Text variant="body-md" marginTop={150}>
                        {goodThing.description}
                      </Text>
                    )}
                    <div className={styles.cardFooter}>
                      <Text variant="body-sm" color="neutral-600">
                        {formatDate(goodThing.completion_date)}
                      </Text>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
