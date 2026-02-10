import { Badge, Breadcrumbs, Button, Loading, Text } from '@workpace/design-system'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import { NotionTemplate } from '@/apis/controllers/templates'

import { slugify } from '../utils'
import styles from './TemplateDetail.module.scss'

/* ── Type-assertion workaround for polymorphic Button ── */
const ButtonComponent = Button as any

/* ── FAQ Data ── */

const FAQ_ITEMS = [
  {
    question: 'What is a Notion template?',
    answer:
      'A Notion template is a pre-built page or workspace layout that you can duplicate into your own Notion account. It gives you a ready-made structure — databases, views, formulas, and layouts — so you can start organizing immediately instead of building from scratch.',
  },
  {
    question: 'How do I use a Notion template?',
    answer:
      'Click the "Get Template" button to open the template in Notion. From there, click "Duplicate" in the top-right corner to add it to your own workspace. You can then customize it to fit your needs — rename pages, adjust properties, and add your own content.',
  },
  {
    question: 'Are free templates fully functional?',
    answer:
      'Yes! Free templates include all the core structure and functionality you need. They are complete, working systems that you can start using right away. Pro templates may include additional advanced features, automations, or premium layouts.',
  },
  {
    question: 'Can I customize the template after duplicating it?',
    answer:
      'Absolutely. Once a template is in your workspace, you own that copy entirely. You can modify every aspect — change the layout, add or remove properties, adjust formulas, rearrange views, and tailor it to your exact workflow.',
  },
  {
    question: 'Do I need a paid Notion plan to use templates?',
    answer:
      "Most templates work perfectly on Notion's free plan. Some advanced templates that use features like automations or large team collaboration may benefit from a paid Notion plan, but the templates themselves will indicate if any premium Notion features are required.",
  },
  {
    question: 'Will I receive updates to the template?',
    answer:
      'When you duplicate a template, you get a snapshot of it at that point in time. If the template is updated later, you can re-duplicate it to get the latest version. Your existing customizations in the original copy will remain untouched.',
  },
]

/* ── Helpers ── */

function formatPrice(priceCents: number): string {
  if (priceCents === 0) return 'Free'
  const dollars = priceCents / 100
  return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(2)}`
}

/* ── Component ── */

export const TemplateDetail = () => {
  const router = useRouter()
  const { slug } = router.query

  const [template, setTemplate] = useState<NotionTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const fetchTemplate = useCallback(async () => {
    if (!slug || typeof slug !== 'string') return

    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/templates')
      if (!res.ok) {
        throw new Error(`Failed to fetch templates (${res.status})`)
      }
      const data: NotionTemplate[] = await res.json()
      const match = data.find((t) => slugify(t.title) === slug)

      if (!match) {
        setError('Template not found')
      } else {
        setTemplate(match)
      }
    } catch (err) {
      console.error('[TemplateDetail] Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load template')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchTemplate()
  }, [fetchTemplate])

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index))
  }

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Loading size="lg" />
      </div>
    )
  }

  /* ── Error / Not Found ── */
  if (error || !template) {
    return (
      <div className={styles.errorState}>
        <Text as="p" variant="headline-sm" className={styles.errorTitle}>
          {error === 'Template not found' ? 'Template Not Found' : 'Something Went Wrong'}
        </Text>
        <Text as="p" variant="body-md" className={styles.errorSubtitle}>
          {error === 'Template not found'
            ? "We couldn't find the template you're looking for."
            : error}
        </Text>
        <Link href="/templates" className={styles.backLink}>
          &larr; Back to Templates
        </Link>
      </div>
    )
  }

  /* ── Main Render ── */
  return (
    <div className={styles.page}>
      <Breadcrumbs
        linkAs={Link}
        items={[{ label: 'Templates', href: '/templates' }, { label: template.title }]}
        size="lg"
      />
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <h1 className={styles.title}>{template.title}</h1>
        {template.description && <p className={styles.subtitle}>{template.description}</p>}
      </section>
      {/* ── Get Template Section ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          {/* Template Preview Image */}
          {template.image_url && (
            <div className={styles.ctaImageWrapper}>
              <Image
                src={template.image_url}
                alt={template.title}
                fill
                className={styles.ctaImage}
                sizes="(max-width: 640px) 100vw, 560px"
              />
            </div>
          )}

          {/* Template Info Card */}
          <div className={styles.ctaInfo}>
            <div className={styles.ctaMeta}>
              <Badge variant="outline" size="md">
                {template.category}
              </Badge>
              <span className={styles.ctaPrice}>{formatPrice(template.price_cents)}</span>
            </div>

            <Text as="p" variant="body-md" className={styles.ctaDescription}>
              {template.description_long ??
                template.description ??
                'A beautifully crafted Notion template to help you stay organized and productive.'}
            </Text>

            <ButtonComponent
              as="a"
              href={template.template_link}
              target="_blank"
              rel="noopener noreferrer"
              variant="default-primary"
            >
              Get Template
            </ButtonComponent>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className={styles.faqSection}>
        <Text as="h2" variant="headline-md" className={styles.faqTitle}>
          Frequently Asked Questions
        </Text>
        <Text as="p" variant="body-md" className={styles.faqSubtitle}>
          Everything you need to know about using Notion templates.
        </Text>

        <div className={styles.faqList}>
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openFaqIndex === index ? styles.faqItemOpen : ''}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFaq(index)}
                type="button"
                aria-expanded={openFaqIndex === index}
              >
                <span>{item.question}</span>
                <svg
                  className={styles.faqChevron}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openFaqIndex === index && (
                <div className={styles.faqAnswer}>
                  <Text as="p" variant="body-md">
                    {item.answer}
                  </Text>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
