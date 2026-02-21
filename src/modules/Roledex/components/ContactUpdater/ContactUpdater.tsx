import { useManualFetch } from '@/hooks'
import { HttpResponse } from '@/server/types'
import { Button, InputField, Text } from '@workpace/design-system'
import { useState } from 'react'
import styles from './ContactUpdater.module.scss'

interface ContactResult {
  action: 'updated' | 'created'
  contactName: string
  detail: string
  pageId: string
}

interface ContactUpdaterProps {
  hasDatabase: boolean
}

export const ContactUpdater = ({ hasDatabase }: ContactUpdaterProps) => {
  const [prompt, setPrompt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ContactResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submitPrompt = useManualFetch<HttpResponse<ContactResult>>('roledex/contacts')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || !hasDatabase || isSubmitting) return

    setIsSubmitting(true)
    setResult(null)
    setError(null)

    try {
      const [response, fetchError] = await submitPrompt({
        method: 'post',
        data: { prompt: prompt.trim() },
      })

      if (fetchError) {
        setError(fetchError.message || 'Failed to process prompt')
      } else if (response?.data) {
        setResult(response.data)
        setPrompt('')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process prompt')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`${styles.card} ${!hasDatabase ? styles.disabled : ''}`}>
      <div className={styles.header}>
        <Text as="h3" variant="headline-sm">
          Update Contact
        </Text>
        <Text variant="body-sm" color="neutral-400" marginTop={100}>
          Use natural language to add or update contact details
        </Text>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <InputField
            dark
            label="Prompt"
            placeholder="e.g. Andrew Chimes likes baseball and works at Acme Corp"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!hasDatabase || isSubmitting}
          />
        </div>
        <Button
          type="submit"
          variant="brand-secondary"
          disabled={!hasDatabase || !prompt.trim() || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Submit'}
        </Button>
      </form>

      {result && (
        <div className={`${styles.result} ${styles.success}`}>
          <Text variant="body-sm">
            {result.action === 'updated'
              ? `Updated ${result.contactName}`
              : `Created new contact: ${result.contactName}`}
          </Text>
        </div>
      )}

      {error && (
        <div className={`${styles.result} ${styles.error}`}>
          <Text variant="body-sm">{error}</Text>
        </div>
      )}
    </div>
  )
}
