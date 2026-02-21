import { Badge, Button, Loading, Text } from '@workpace/design-system'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { NotionTemplate, TemplateCategory } from '@/apis/controllers/templates'
import { Routes } from '@/interfaces/routes'

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
    <div>
      {/* ── Integration Banner ── */}
      <div className={styles.integrationBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerLogos}>
            <span className={styles.bannerLogo}>W</span>
            <span className={styles.bannerConnector}>+</span>
            <span className={styles.bannerLogo}>N</span>
          </div>
          <div className={styles.bannerText}>
            <Text as="p" variant="body-md" className={styles.bannerTitle}>
              Powered by the WorkPace + Notion integration
            </Text>
            <Text as="p" variant="body-sm-paragraph" className={styles.bannerSubtitle}>
              Every template syncs directly into your Notion workspace — duplicate, customize, and
              start building in seconds.
            </Text>
          </div>
          <Link href={Routes.APPS} className={styles.bannerCta}>
            <Button as="span" variant="default-secondary" className={styles.bannerButton}>
              View Integrations
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Category Filters ── */}
      <div className={styles.filters}>
        <Badge
          as="button"
          variant={activeCategory === null ? 'default' : 'outline'}
          size="md"
          className={activeCategory === null ? styles.filterActive : styles.filterInactive}
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
            className={activeCategory === cat ? styles.filterActive : styles.filterInactive}
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
            className={pricingFilter === opt.value ? styles.filterActive : styles.filterInactive}
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
                    width={600}
                    height={375}
                    className={styles.cardImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                <div className={styles.cardHeader}>
                  <p className={styles.cardTitle}>{template.title}</p>
                  <span
                    className={template.price_cents === 0 ? styles.cardPriceFree : styles.cardPrice}
                  >
                    {formatPrice(template.price_cents)}
                  </span>
                </div>
                {template.description && (
                  <p className={styles.cardDescription}>{template.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
