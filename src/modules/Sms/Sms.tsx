import { Breadcrumbs, Button, InputField, Text } from '@workpace/design-system'
import Link from 'next/link'
import { useState } from 'react'

import styles from './Sms.module.scss'

type SendStatus = 'idle' | 'sending' | 'sent' | 'error'

export const Sms = () => {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<SendStatus>('idle')
  const [errorText, setErrorText] = useState('')

  const handleSend = async () => {
    setErrorText('')

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorText('Please enter a valid phone number.')
      return
    }
    if (!message.trim()) {
      setErrorText('Please enter a message.')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), message: message.trim() }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message || `Request failed (${res.status})`)
      }

      setStatus('sent')
      setPhone('')
      setMessage('')

      // Reset success banner after a few seconds
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err: unknown) {
      console.error('[Sms] SMS send error', err)
      setErrorText(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbsWrapper}>
        <Breadcrumbs
          linkAs={Link}
          items={[{ label: 'Apps', href: '/apps' }, { label: 'SMS' }]}
          size="lg"
        />
      </div>
      <div className={styles.container}>
        {/* ── SMS Send Section ─────────────────────────────── */}
        <div className={styles.smsSection}>
          <Text as="h2" variant="headline-sm" className={styles.smsHeading}>
            Send a Quick Text
          </Text>

          <div className={styles.smsForm}>
            <InputField
              label="Phone number"
              placeholder="+1 555 123 4567"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.smsField}
            />

            <InputField
              label="Message"
              placeholder="Hey, check this out!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.smsField}
            />

            {errorText && (
              <Text as="p" variant="body-sm" className={styles.smsError}>
                {errorText}
              </Text>
            )}

            {status === 'sent' && (
              <Text as="p" variant="body-sm" className={styles.smsSuccess}>
                Message sent!
              </Text>
            )}

            <Button
              variant="brand-primary"
              onClick={handleSend}
              disabled={status === 'sending'}
              className={styles.smsButton}
            >
              {status === 'sending' ? 'Sending…' : 'Send SMS'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
