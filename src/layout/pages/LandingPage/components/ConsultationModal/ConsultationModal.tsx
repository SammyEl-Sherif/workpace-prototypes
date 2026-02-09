import { useCallback, useEffect, useRef, useState } from 'react'

import { Button, InputField, Select, Text } from '@workpace/design-system'
import cn from 'classnames'

import styles from './ConsultationModal.module.scss'

const ButtonComponent = Button as any

const BOOKING_URL = 'https://calendar.notion.so/meet/sammyel-sherif/workpace'

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormStep = 'details' | 'project' | 'confirm'

interface FormData {
  name: string
  email: string
  company: string
  service: string
  budget: string
  timeline: string
  message: string
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  company: '',
  service: '',
  budget: '',
  timeline: '',
  message: '',
}

const STEPS: { key: FormStep; label: string; number: number }[] = [
  { key: 'details', label: 'Your Details', number: 1 },
  { key: 'project', label: 'Project Info', number: 2 },
  { key: 'confirm', label: 'Confirm', number: 3 },
]

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const [step, setStep] = useState<FormStep>('details')
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep('details')
      setForm(INITIAL_FORM)
      setIsSubmitted(false)
      setIsSubmitting(false)
      setSubmitError(null)
      setIsAnimatingOut(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      onClose()
    }, 250)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose()
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 'details') setStep('project')
    else if (step === 'project') setStep('confirm')
  }

  const handleBack = () => {
    if (step === 'project') setStep('details')
    else if (step === 'confirm') setStep('project')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/consultation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          service: form.service,
          budget: form.budget || undefined,
          timeline: form.timeline || undefined,
          message: form.message || undefined,
        }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || 'Failed to submit request')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('[ConsultationModal] Submit error:', error)
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const currentStepIndex = STEPS.findIndex((s) => s.key === step)

  return (
    <div
      className={cn(styles.overlay, { [styles.animatingOut]: isAnimatingOut })}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Book a Consultation"
    >
      <div className={cn(styles.modal, { [styles.animatingOut]: isAnimatingOut })}>
        {/* Close button */}
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
          ✕
        </button>

        {isSubmitted ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <Text as="h2" variant="headline-md" className={styles.successTitle}>
              Request Submitted!
            </Text>
            <Text as="p" variant="body-md-paragraph" className={styles.successDescription}>
              Thank you, {form.name}! We&apos;ve received your consultation request and will review
              it shortly. We&apos;ll follow up at <strong>{form.email}</strong>.
            </Text>

            <div className={styles.bookingSection}>
              <div className={styles.bookingDivider}>
                <span className={styles.bookingDividerText}>Want to get started sooner?</span>
              </div>
              <Text as="p" variant="body-sm-paragraph" className={styles.bookingDescription}>
                Skip the wait and book a meeting time directly on our calendar.
              </Text>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bookingLink}
              >
                <ButtonComponent variant="brand-secondary">
                  Book a Meeting →
                </ButtonComponent>
              </a>
            </div>

            <ButtonComponent variant="default-secondary" onClick={handleClose}>
              Close
            </ButtonComponent>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className={styles.header}>
              <Text as="h2" variant="headline-md" className={styles.modalTitle}>
                Book a Consultation
              </Text>
              <Text as="p" variant="body-sm-paragraph" className={styles.modalSubtitle}>
                Tell us about your project and we&apos;ll get back to you within 1-2 business days.
                Or{' '}
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inlineBookingLink}
                >
                  book a meeting directly
                </a>
                .
              </Text>
            </div>

            {/* Step Progress */}
            <div className={styles.stepper}>
              {STEPS.map((s, i) => (
                <div key={s.key} className={styles.stepperItem}>
                  <div
                    className={cn(styles.stepCircle, {
                      [styles.active]: i === currentStepIndex,
                      [styles.completed]: i < currentStepIndex,
                    })}
                  >
                    {i < currentStepIndex ? '✓' : s.number}
                  </div>
                  <Text
                    as="span"
                    variant="body-xs"
                    className={cn(styles.stepLabel, {
                      [styles.active]: i === currentStepIndex,
                      [styles.completed]: i < currentStepIndex,
                    })}
                  >
                    {s.label}
                  </Text>
                  {i < STEPS.length - 1 && <div className={cn(styles.stepLine, {
                    [styles.completed]: i < currentStepIndex,
                  })} />}
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <div className={styles.formBody}>
              {step === 'details' && (
                <div className={styles.formStep}>
                  <InputField
                    label="Full Name"
                    value={form.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
                    required
                  />
                  <InputField
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
                    required
                  />
                  <InputField
                    label="Company / Organization"
                    value={form.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('company', e.target.value)}
                  />
                </div>
              )}

              {step === 'project' && (
                <div className={styles.formStep}>
                  <Select
                    label="Service Needed"
                    value={form.service}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('service', e.target.value)}
                    placeholder="Select a service"
                    required
                  >
                    <option value="notion-templates">Notion Templates</option>
                    <option value="notion-consulting">Notion Consulting</option>
                    <option value="software-products">Software Products</option>
                    <option value="software-consulting">Software Consulting</option>
                    <option value="other">Other</option>
                  </Select>
                  <Select
                    label="Estimated Budget"
                    value={form.budget}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('budget', e.target.value)}
                    placeholder="Select a range"
                  >
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 – $5,000</option>
                    <option value="5k-15k">$5,000 – $15,000</option>
                    <option value="15k-50k">$15,000 – $50,000</option>
                    <option value="50k+">$50,000+</option>
                    <option value="unsure">Not sure yet</option>
                  </Select>
                  <Select
                    label="Timeline"
                    value={form.timeline}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField('timeline', e.target.value)}
                    placeholder="Select a timeline"
                  >
                    <option value="asap">ASAP</option>
                    <option value="1-2-weeks">1–2 weeks</option>
                    <option value="1-month">Within a month</option>
                    <option value="1-3-months">1–3 months</option>
                    <option value="flexible">Flexible</option>
                  </Select>
                </div>
              )}

              {step === 'confirm' && (
                <div className={styles.formStep}>
                  <div className={styles.textareaWrapper}>
                    <label className={styles.textareaLabel}>
                      <Text as="span" variant="body-sm" className={styles.textareaLabelText}>
                        Tell us about your project
                      </Text>
                    </label>
                    <textarea
                      className={styles.textarea}
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      rows={4}
                      placeholder="Describe your project, goals, and any specific requirements..."
                    />
                  </div>

                  {/* Summary */}
                  <div className={styles.summary}>
                    <Text as="h4" variant="body-md-emphasis" className={styles.summaryTitle}>
                      Summary
                    </Text>
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <Text as="span" variant="body-xs" className={styles.summaryLabel}>
                          Name
                        </Text>
                        <Text as="span" variant="body-sm">
                          {form.name || '—'}
                        </Text>
                      </div>
                      <div className={styles.summaryItem}>
                        <Text as="span" variant="body-xs" className={styles.summaryLabel}>
                          Email
                        </Text>
                        <Text as="span" variant="body-sm">
                          {form.email || '—'}
                        </Text>
                      </div>
                      <div className={styles.summaryItem}>
                        <Text as="span" variant="body-xs" className={styles.summaryLabel}>
                          Company
                        </Text>
                        <Text as="span" variant="body-sm">
                          {form.company || '—'}
                        </Text>
                      </div>
                      <div className={styles.summaryItem}>
                        <Text as="span" variant="body-xs" className={styles.summaryLabel}>
                          Service
                        </Text>
                        <Text as="span" variant="body-sm">
                          {form.service ? form.service.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—'}
                        </Text>
                      </div>
                      <div className={styles.summaryItem}>
                        <Text as="span" variant="body-xs" className={styles.summaryLabel}>
                          Budget
                        </Text>
                        <Text as="span" variant="body-sm">
                          {form.budget ? form.budget.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—'}
                        </Text>
                      </div>
                      <div className={styles.summaryItem}>
                        <Text as="span" variant="body-xs" className={styles.summaryLabel}>
                          Timeline
                        </Text>
                        <Text as="span" variant="body-sm">
                          {form.timeline ? form.timeline.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—'}
                        </Text>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <div className={styles.errorBanner}>
                      <Text as="p" variant="body-sm" className={styles.errorText}>
                        {submitError}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className={styles.footer}>
              {step !== 'details' ? (
                <ButtonComponent variant="default-secondary" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </ButtonComponent>
              ) : (
                <div />
              )}
              {step === 'confirm' ? (
                <ButtonComponent
                  variant="brand-secondary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Request'}
                </ButtonComponent>
              ) : (
                <ButtonComponent variant="brand-secondary" onClick={handleNext}>
                  Continue
                </ButtonComponent>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ConsultationModal
