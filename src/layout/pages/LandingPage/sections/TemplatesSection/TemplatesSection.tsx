import { useState } from 'react'

import { Badge, Button, Text } from '@workpace/design-system'
import cn from 'classnames'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { Routes } from '@/interfaces/routes'

import styles from './TemplatesSection.module.scss'

const ButtonComponent = Button as any

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Perfect for individuals getting started',
    features: [
      'Access to free templates',
      'Basic documentation',
      'Community support',
      'Regular updates',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$10',
    period: '/mo',
    description: 'Unlimited access for serious professionals',
    features: [
      'All free features included',
      'Unlimited premium templates',
      'Priority support',
      'Early access to new templates',
      'Advanced customization guides',
      'Monthly template updates',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
]

const TemplatesSection = () => {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  const handleUpgradeToPro = async () => {
    setIsCheckoutLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const result = await response.json()

      if (!response.ok || !result.data?.url) {
        console.error('[TemplatesSection] Checkout error:', result)
        alert('Unable to start checkout. Please try again.')
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = result.data.url
    } catch (error) {
      console.error('[TemplatesSection] Checkout error:', error)
      alert('Unable to start checkout. Please try again.')
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  return (
    <section id="templates" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Text as="h2" variant="headline-lg" className={styles.title}>
              Notion Templates
            </Text>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <Text as="p" variant="body-lg-paragraph" className={styles.subtitle}>
              Choose the plan that fits your needs. All templates are designed to boost productivity
              and streamline your workflow.
            </Text>
          </motion.div>
        </div>

        <div className={styles.grid}>
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={cn(styles.card, { [styles.popularCard]: plan.popular })}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 + index * 0.15 }}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <Badge variant="info" size="sm">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className={styles.cardHeader}>
                <Text as="h3" variant="headline-sm" className={styles.planName}>
                  {plan.name}
                </Text>
                <div className={styles.price}>
                  <span className={styles.priceValue}>{plan.price}</span>
                  {plan.period && <span className={styles.pricePeriod}>{plan.period}</span>}
                </div>
                <Text as="p" variant="body-sm-paragraph" className={styles.planDescription}>
                  {plan.description}
                </Text>
              </div>

              <hr className={styles.cardDivider} />

              <div className={styles.cardContent}>
                <ul className={styles.featureList}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.featureItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <Text as="span" variant="body-md">
                        {feature}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                {plan.popular ? (
                  <ButtonComponent
                    variant="brand-secondary"
                    className={styles.ctaButton}
                    onClick={handleUpgradeToPro}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? 'Loading…' : plan.cta}
                  </ButtonComponent>
                ) : (
                  <Link href={Routes.TEMPLATES} className={styles.ctaLink}>
                    <ButtonComponent
                      as="span"
                      variant="default-secondary"
                      className={styles.ctaButton}
                    >
                      {plan.cta}
                    </ButtonComponent>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TemplatesSection
