import { Badge, Loading, Text } from '@workpace/design-system'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import styles from './CardGrid.module.scss'

export interface CardItem {
  id: string
  title: string
  description: string | null
  image_url: string | null
  pricing_type: 'free' | 'paid'
  price_cents: number
  href: string
}

interface CardGridProps {
  items: CardItem[]
  isLoading: boolean
  error: string | null
  emptyLabel?: string
  banner?: ReactNode
}

function formatPrice(priceCents: number): string {
  if (priceCents === 0) return '$0'
  const dollars = priceCents / 100
  return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(0)}`
}

export function CardGrid({
  items,
  isLoading,
  error,
  emptyLabel = 'No items found',
  banner,
}: CardGridProps) {
  return (
    <div>
      {banner}

      {isLoading && (
        <div className={styles.loadingState}>
          <Loading size="lg" />
        </div>
      )}

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

      {!isLoading && !error && (
        <div className={styles.grid}>
          {items.length === 0 && (
            <div className={styles.emptyState}>
              <Text as="p" variant="headline-sm" className={styles.emptyTitle}>
                {emptyLabel}
              </Text>
              <Text as="p" variant="body-md" className={styles.emptySubtitle}>
                Try adjusting your search or filters.
              </Text>
            </div>
          )}

          {items.map((item) => (
            <Link key={item.id} href={item.href} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={600}
                    height={375}
                    className={styles.cardImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder}>{item.title[0]}</div>
                )}
                {item.pricing_type === 'paid' && (
                  <Badge variant="default" size="sm" className={styles.cardProBadge}>
                    PRO
                  </Badge>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <p className={styles.cardTitle}>{item.title}</p>
                  <span
                    className={item.price_cents === 0 ? styles.cardPriceFree : styles.cardPrice}
                  >
                    {formatPrice(item.price_cents)}
                  </span>
                </div>
                {item.description && <p className={styles.cardDescription}>{item.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
