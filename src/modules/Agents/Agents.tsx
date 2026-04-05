import { useCallback, useEffect, useMemo, useState } from 'react'

import { Agent, AgentCategory } from '@/apis/controllers/agents'
import { CardGrid, CardItem } from '@/components/CardGrid'
import { FilterBar } from '@/components/FilterBar'
import { PageBanner } from '@/components/PageBanner'
import { Routes } from '@/interfaces/routes'

import styles from './Agents.module.scss'
import { slugify } from './utils'

/* ── Types ── */

type PricingFilter = 'all' | 'free' | 'paid'

/* ── Constants ── */

const CATEGORY_OPTIONS: { label: string; value: AgentCategory }[] = [
  { label: 'Productivity', value: 'Productivity' },
  { label: 'Communication', value: 'Communication' },
  { label: 'Data & Analytics', value: 'Data & Analytics' },
  { label: 'Content', value: 'Content' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Custom', value: 'Custom' },
]

const PRICING_OPTIONS: { label: string; value: PricingFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
]

/* ── Component ── */

export const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<AgentCategory | null>(null)
  const [pricingFilter, setPricingFilter] = useState<PricingFilter>('all')

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/agents')
      if (!res.ok) {
        throw new Error(`Failed to fetch agents (${res.status})`)
      }
      const data: Agent[] = await res.json()
      setAgents(data)
    } catch (err) {
      console.error('[Agents] Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load agents')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const filtered = useMemo(() => {
    let results = agents

    if (activeCategory) {
      results = results.filter((a) => a.category === activeCategory)
    }

    if (pricingFilter !== 'all') {
      results = results.filter((a) => a.pricing_type === pricingFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      )
    }

    return results
  }, [agents, search, activeCategory, pricingFilter])

  const cardItems: CardItem[] = useMemo(
    () =>
      filtered.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        image_url: a.image_url,
        pricing_type: a.pricing_type,
        price_cents: a.price_cents,
        href: `/agents/${slugify(a.title)}`,
      })),
    [filtered]
  )

  return (
    <div>
      <PageBanner
        logos={{ left: 'W', right: 'N' }}
        title="Powered by the WorkPace + Notion integration"
        subtitle="Supercharge your workspace with agents and templates. Duplicate, customize, and start building in seconds."
        ctaLabel="Browse Templates"
        ctaHref={Routes.TEMPLATES}
      />

      <FilterBar
        options={CATEGORY_OPTIONS}
        activeValue={activeCategory}
        onSelect={setActiveCategory}
      />

      <div className={styles.pricingFilters}>
        <FilterBar
          options={PRICING_OPTIONS.filter((o) => o.value !== 'all')}
          activeValue={pricingFilter === 'all' ? null : pricingFilter}
          onSelect={(val) => setPricingFilter(val ?? 'all')}
          allLabel="All"
          size="sm"
        />
      </div>

      <CardGrid
        items={cardItems}
        isLoading={isLoading}
        error={error}
        emptyLabel="No agents found"
      />
    </div>
  )
}
