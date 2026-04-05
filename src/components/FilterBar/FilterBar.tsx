import { Badge } from '@workpace/design-system'

import styles from './FilterBar.module.scss'

interface FilterOption<T extends string> {
  label: string
  value: T
}

interface FilterBarProps<T extends string> {
  options: FilterOption<T>[]
  activeValue: T | null
  onSelect: (value: T | null) => void
  allLabel?: string
  size?: 'sm' | 'md'
}

export function FilterBar<T extends string>({
  options,
  activeValue,
  onSelect,
  allLabel = 'All',
  size = 'md',
}: FilterBarProps<T>) {
  return (
    <div className={styles.filters}>
      <Badge
        as="button"
        variant={activeValue === null ? 'default' : 'outline'}
        size={size}
        className={activeValue === null ? styles.filterActive : styles.filterInactive}
        onClick={() => onSelect(null)}
      >
        {allLabel}
      </Badge>
      {options.map((opt) => (
        <Badge
          key={opt.value}
          as="button"
          variant={activeValue === opt.value ? 'default' : 'outline'}
          size={size}
          className={activeValue === opt.value ? styles.filterActive : styles.filterInactive}
          onClick={() => onSelect(opt.value)}
        >
          {opt.label}
        </Badge>
      ))}
    </div>
  )
}
