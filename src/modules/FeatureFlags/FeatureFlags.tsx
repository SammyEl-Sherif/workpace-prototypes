import { Badge, Button, Loading, Text } from '@workpace/design-system'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { FeatureFlag } from '@/apis/controllers/feature-flags/feature-flags.types'
import { useManualFetch } from '@/hooks'

import styles from './FeatureFlags.module.scss'

type FilterType = 'all' | 'enabled' | 'disabled'

interface FlagFormData {
  key: string
  name: string
  description: string
  enabled: boolean
}

const EMPTY_FORM: FlagFormData = {
  key: '',
  name: '',
  description: '',
  enabled: false,
}

export const FeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null)
  const [deletingFlag, setDeletingFlag] = useState<FeatureFlag | null>(null)
  const [formData, setFormData] = useState<FlagFormData>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetcher = useManualFetch<FeatureFlag[]>('', {})
  const mutator = useManualFetch<FeatureFlag>('', {})
  const deleter = useManualFetch<{ success: boolean }>('', {})

  // Fetch all flags
  const loadFlags = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const [data, err] = await fetcher({
      url: 'feature-flags',
      method: 'get',
    })
    if (err) {
      setError('Failed to load feature flags.')
    } else {
      setFlags(data ?? [])
    }
    setIsLoading(false)
  }, [fetcher])

  useEffect(() => {
    loadFlags()
  }, [])

  // Filtered flags
  const filteredFlags = useMemo(() => {
    let result = flags

    if (filter === 'enabled') {
      result = result.filter((f) => f.enabled)
    } else if (filter === 'disabled') {
      result = result.filter((f) => !f.enabled)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (f) =>
          f.key.toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q)
      )
    }

    return result
  }, [flags, filter, search])

  // Toggle flag
  const handleToggle = useCallback(
    async (flag: FeatureFlag) => {
      const [data, err] = await mutator({
        url: `feature-flags/${flag.id}`,
        method: 'patch',
      })
      if (!err && data) {
        setFlags((prev) => prev.map((f) => (f.id === data.id ? data : f)))
      }
    },
    [mutator]
  )

  // Open create modal
  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM)
    setFormError(null)
    setShowCreateModal(true)
  }

  // Open edit modal
  const handleOpenEdit = (flag: FeatureFlag) => {
    setFormData({
      key: flag.key,
      name: flag.name,
      description: flag.description ?? '',
      enabled: flag.enabled,
    })
    setFormError(null)
    setEditingFlag(flag)
  }

  // Submit create/edit
  const handleSubmit = useCallback(async () => {
    setFormError(null)
    setIsSubmitting(true)

    if (!formData.key.trim() || !formData.name.trim()) {
      setFormError('Key and name are required.')
      setIsSubmitting(false)
      return
    }

    const keyRegex = /^[a-z][a-z0-9_-]*$/
    if (!keyRegex.test(formData.key)) {
      setFormError('Key must start with a lowercase letter and contain only lowercase letters, numbers, hyphens, and underscores.')
      setIsSubmitting(false)
      return
    }

    if (editingFlag) {
      // Update
      const [data, err] = await mutator({
        url: `feature-flags/${editingFlag.id}`,
        method: 'put',
        data: formData,
      })
      if (err) {
        setFormError('Failed to update feature flag. The key may already be in use.')
      } else if (data) {
        setFlags((prev) => prev.map((f) => (f.id === data.id ? data : f)))
        setEditingFlag(null)
      }
    } else {
      // Create
      const [data, err] = await mutator({
        url: 'feature-flags',
        method: 'post',
        data: formData,
      })
      if (err) {
        setFormError('Failed to create feature flag. The key may already be in use.')
      } else if (data) {
        setFlags((prev) => [data, ...prev])
        setShowCreateModal(false)
      }
    }
    setIsSubmitting(false)
  }, [formData, editingFlag, mutator])

  // Delete flag
  const handleDelete = useCallback(async () => {
    if (!deletingFlag) return
    setIsSubmitting(true)

    const [, err] = await deleter({
      url: `feature-flags/${deletingFlag.id}`,
      method: 'delete',
    })
    if (!err) {
      setFlags((prev) => prev.filter((f) => f.id !== deletingFlag.id))
      setDeletingFlag(null)
    } else {
      setFormError('Failed to delete feature flag.')
    }
    setIsSubmitting(false)
  }, [deletingFlag, deleter])

  // Close modals
  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingFlag(null)
    setDeletingFlag(null)
    setFormError(null)
    setFormData(EMPTY_FORM)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Text variant="headline-md">Feature Flags</Text>
          <Text variant="body-sm" className={styles.flagCount}>
            {flags.length} flag{flags.length !== 1 ? 's' : ''} configured
          </Text>
        </div>
        <Button variant="brand-primary" onClick={handleOpenCreate}>
          Create Flag
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <Button variant="default-secondary" onClick={loadFlags}>
            Retry
          </Button>
        </div>
      )}

      {/* Toolbar */}
      {flags.length > 0 && (
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder="Search flags by key, name, or description..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.filterButtons}>
            <button
              className={filter === 'all' ? styles.filterButtonActive : styles.filterButton}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'enabled' ? styles.filterButtonActive : styles.filterButton}
              onClick={() => setFilter('enabled')}
            >
              Enabled
            </button>
            <button
              className={filter === 'disabled' ? styles.filterButtonActive : styles.filterButton}
              onClick={() => setFilter('disabled')}
            >
              Disabled
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && flags.length === 0 && !error && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>&#9873;</div>
          <Text variant="headline-sm">No feature flags yet</Text>
          <Text variant="body-md" className={styles.emptyText}>
            Create your first feature flag to start controlling features across your app.
          </Text>
          <Button variant="brand-primary" onClick={handleOpenCreate}>
            Create Your First Flag
          </Button>
        </div>
      )}

      {/* No results from filter */}
      {!isLoading && flags.length > 0 && filteredFlags.length === 0 && (
        <div className={styles.emptyState}>
          <Text variant="body-md" className={styles.emptyText}>
            No flags match your search or filter.
          </Text>
        </div>
      )}

      {/* Flags list */}
      {!isLoading && filteredFlags.length > 0 && (
        <div className={styles.flagsList}>
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className={`${styles.flagCard} ${
                flag.enabled ? styles.flagCardEnabled : styles.flagCardDisabled
              }`}
            >
              <div className={styles.flagRow}>
                <div className={styles.flagInfo}>
                  <span className={styles.flagKey}>{flag.key}</span>
                  <div className={styles.flagName}>{flag.name}</div>
                  {flag.description && (
                    <div className={styles.flagDescription}>{flag.description}</div>
                  )}
                </div>

                <div className={styles.flagActions}>
                  <Badge variant={flag.enabled ? 'success' : 'neutral'}>
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>

                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={flag.enabled}
                      onChange={() => handleToggle(flag)}
                    />
                    <span className={styles.toggleSlider} />
                  </label>

                  <Button variant="default-secondary" onClick={() => handleOpenEdit(flag)}>
                    Edit
                  </Button>
                  <Button variant="default-secondary" onClick={() => setDeletingFlag(flag)}>
                    Delete
                  </Button>
                </div>
              </div>

              <div className={styles.flagMeta}>
                <span>Created: {formatDate(flag.created_at)}</span>
                <span>Updated: {formatDate(flag.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {(showCreateModal || editingFlag) && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text variant="headline-sm" className={styles.modalTitle}>
              {editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
            </Text>

            {formError && <div className={styles.error}>{formError}</div>}

            <div className={styles.form}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Flag Key</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. enable-new-dashboard"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, key: e.target.value.toLowerCase() }))
                  }
                />
                <span className={styles.formHint}>
                  Lowercase letters, numbers, hyphens, and underscores only. Used in code to reference this flag.
                </span>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Display Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. New Dashboard"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Describe what this flag controls..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              <div className={styles.formField}>
                <div className={styles.formToggleRow}>
                  <label className={styles.formLabel}>Initial State</label>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      className={styles.toggleInput}
                      checked={formData.enabled}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, enabled: e.target.checked }))
                      }
                    />
                    <span className={styles.toggleSlider} />
                  </label>
                </div>
                <span className={styles.formHint}>
                  {formData.enabled ? 'Flag will be enabled immediately' : 'Flag will be created in disabled state'}
                </span>
              </div>

              <div className={styles.formActions}>
                <Button variant="default-secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="brand-primary" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingFlag ? 'Update Flag' : 'Create Flag'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingFlag && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text variant="headline-sm" className={styles.modalTitle}>
              Delete Feature Flag
            </Text>

            {formError && <div className={styles.error}>{formError}</div>}

            <p className={styles.deleteWarning}>
              Are you sure you want to delete the flag{' '}
              <span className={styles.deleteKeyName}>{deletingFlag.key}</span>? This action cannot
              be undone. Any code referencing this flag will no longer receive a value.
            </p>

            <div className={styles.formActions}>
              <Button variant="default-secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="brand-primary" onClick={handleDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Deleting...' : 'Delete Flag'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
