import { Badge, Loading, Text } from '@workpace/design-system'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { NotionTemplate, TemplateCategory } from '@/apis/controllers/templates'

import styles from './Templates.module.scss'
import { slugify } from './utils'

/* ── Types ── */

type PricingFilter = 'all' | 'free' | 'paid'

/* ── Constants ── */

const ALL_CATEGORIES: TemplateCategory[] = [
  'Productivity',
  'Work',
  'Education',
  'Health & Fitness',
  'Finance',
  'Travel',
  'Seasonal',
]

const PRICING_OPTIONS: { label: string; value: PricingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
]

/* ── Helpers ── */

function formatPrice(priceCents: number): string {
  if (priceCents === 0) return '$0'
  const dollars = priceCents / 100
  return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(0)}`
}

/* ── Component ── */

export const Templates = () => {
  const [templates, setTemplates] = useState<NotionTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | null>(null)
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>('all')

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/templates')
      if (!res.ok) {
        throw new Error(`Failed to fetch templates (${res.status})`)
      }
      const data: NotionTemplate[] = await res.json()
      setTemplates(data)
    } catch (err) {
      console.error('[Templates] Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const filtered = useMemo(() => {
    let results = templates

    // Category filter
    if (activeCategory) {
      results = results.filter((t) => t.category === activeCategory)
    }

    // Pricing filter
    if (pricingFilter !== 'all') {
      results = results.filter((t) => t.pricing_type === pricingFilter)
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }

    return results
  }, [templates, search, activeCategory, pricingFilter])

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Notion Templates</h1>
        <p className={styles.subtitle}>
          Notion templates to change the pace of how you organize work and life.
        </p>
      </section>

      {/* ── Search ── */}

      {/* ── Category Filters ── */}
      <div className={styles.filters}>
        <Badge
          as="button"
          variant={activeCategory === null ? 'default' : 'outline'}
          size="md"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Badge>
        {ALL_CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            as="button"
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="md"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* ── Pricing Toggles ── */}
      <div className={styles.pricingFilters}>
        {PRICING_OPTIONS.map((opt) => (
          <Badge
            key={opt.value}
            as="button"
            variant={pricingFilter === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPricingFilter(opt.value)}
          >
            {opt.label}
          </Badge>
        ))}
      </div>

      {/* ── Loading State ── */}
      {isLoading && (
        <div className={styles.loadingState}>
          <Loading size="lg" />
        </div>
      )}

      {/* ── Error State ── */}
      {error && !isLoading && (
        <div className={styles.emptyState}>
          <Text as="p" variant="headline-sm" className={styles.emptyTitle}>
            Something went wrong
          </Text>
          <Text as="p" variant="body-md" className={styles.emptySubtitle}>
            {error}
          </Text>
        </div>
      )}

      {/* ── Templates Grid ── */}
      {!isLoading && !error && (
        <div className={styles.grid}>
          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              <Text as="p" variant="headline-sm" className={styles.emptyTitle}>
                No templates found
              </Text>
              <Text as="p" variant="body-md" className={styles.emptySubtitle}>
                Try adjusting your search or filters.
              </Text>
            </div>
          )}

          {filtered.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${slugify(template.title)}`}
              className={styles.card}
            >
              {/* Image */}
              <div className={styles.cardImageWrapper}>
                {template.image_url ? (
                  <Image
                    src={template.image_url}
                    alt={template.title}
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder}>{template.title[0]}</div>
                )}
                {template.pricing_type === 'paid' && (
                  <Badge variant="default" size="sm" className={styles.cardProBadge}>
                    PRO
                  </Badge>
                )}
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <p className={styles.cardTitle}>{template.title}</p>
                <span
                  className={template.price_cents === 0 ? styles.cardPriceFree : styles.cardPrice}
                >
                  {formatPrice(template.price_cents)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
