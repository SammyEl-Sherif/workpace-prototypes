import { useGoodThings } from '@/hooks'
import { Badge, Button, Card, CardContent, Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GoodThingForm } from '../GoodThingForm'
import styles from './GoodThingsList.module.scss'

export const GoodThingsList = () => {
  const { goodThings, isLoading, error, refetch } = useGoodThings()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    refetch()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this good thing?')) return

    try {
      const response = await fetch(`/api/good-stuff-list/good-things/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Text>Loading...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Text color="urgent-600">Error loading good things: {error.message}</Text>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text variant="headline-lg-emphasis">Your Good Things</Text>
        <Button
          variant="brand-secondary"
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
          }}
        >
          + Add Good Thing
        </Button>
      </div>

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
            onSuccess={() => {
              setShowForm(false)
              setEditingId(null)
              refetch()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
            }}
          />
        </motion.div>
      )}

      <div className={styles.list}>
        {goodThings.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
            <Text>No good things yet. Add your first one!</Text>
          </motion.div>
        ) : (
          goodThings.map((goodThing, index) => (
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
                        onClick={() => {
                          setEditingId(goodThing.id)
                          setShowForm(true)
                        }}
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
          ))
        )}
      </div>
    </div>
  )
}
