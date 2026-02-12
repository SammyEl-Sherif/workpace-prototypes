import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InputField,
  Text,
} from '@workpace/design-system'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import type { InboundMessage } from '@/pages/api/sms/messages'
import { ChiefOfStaffDatabaseSelector } from './components/ChiefOfStaffDatabaseSelector'
import styles from './Sms.module.scss'

type SendStatus = 'idle' | 'sending' | 'sent' | 'error'

export const Sms = () => {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<SendStatus>('idle')
  const [errorText, setErrorText] = useState('')
  const [messages, setMessages] = useState<InboundMessage[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  const fetchMessages = async () => {
    setIsLoadingMessages(true)
    try {
      const res = await fetch('/api/sms/messages?type=text&limit=50')
      if (!res.ok) {
        throw new Error(`Failed to fetch messages (${res.status})`)
      }
      const data = await res.json()
      setMessages(data.data?.messages || [])
    } catch (err: unknown) {
      console.error('[Sms] Error fetching messages:', err)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

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

      // Refresh messages after sending
      await fetchMessages()

      // Reset success banner after a few seconds
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err: unknown) {
      console.error('[Sms] SMS send error', err)
      setErrorText(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbsWrapper}>
        <Breadcrumbs
          linkAs={Link}
          items={[{ label: 'Apps', href: '/apps' }, { label: 'Chief of Staff' }]}
          size="lg"
        />
      </div>
      <div className={styles.container}>
        {/* ── Chief of Staff Database Selection ─────────────────────────────── */}
        <div className={styles.chiefOfStaffSection}>
          <ChiefOfStaffDatabaseSelector />
        </div>

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

        {/* ── Inbound Messages Section ─────────────────────────────── */}
        <div className={styles.messagesSection}>
          <Text as="h2" variant="headline-sm" className={styles.messagesHeading}>
            Inbound Messages
          </Text>

          {isLoadingMessages ? (
            <Text as="p" variant="body-md" className={styles.messagesLoading}>
              Loading messages...
            </Text>
          ) : messages.length === 0 ? (
            <Text as="p" variant="body-md" className={styles.messagesEmpty}>
              No messages received yet.
            </Text>
          ) : (
            <div className={styles.messagesList}>
              {messages.map((msg) => (
                <Card key={msg.id} variant="default" className={styles.messageCard}>
                  <CardHeader>
                    <div className={styles.messageHeader}>
                      <div>
                        <CardTitle className={styles.messageSender}>
                          {msg.sender_name ||
                            msg.sender_phone_number ||
                            msg.sender_email ||
                            'Unknown'}
                        </CardTitle>
                        <Text as="p" variant="body-sm" className={styles.messageMeta}>
                          {msg.sender_phone_number && (
                            <span className={styles.messagePhone}>{msg.sender_phone_number}</span>
                          )}
                          {msg.sender_phone_number && msg.sender_email && <span> • </span>}
                          {msg.sender_email && (
                            <span className={styles.messageEmail}>{msg.sender_email}</span>
                          )}
                        </Text>
                      </div>
                      <Text as="p" variant="body-xs" className={styles.messageTime}>
                        {formatDate(msg.received_at)}
                      </Text>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Text as="p" variant="body-md" className={styles.messageBody}>
                      {msg.message_body}
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
