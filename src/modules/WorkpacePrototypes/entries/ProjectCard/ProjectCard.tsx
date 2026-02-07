import { motion } from 'framer-motion'
import Link from 'next/link'

import { useUser } from '@/hooks/useUser'
import { Prototype, PrototypeStage } from '@/interfaces/prototypes'

import styles from './ProjectCard.module.scss'

const CARD_THEMES: Record<string, { gradient: string; accent: string }> = {
  '📝': { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#667eea' },
  '💰': { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#f5576c' },
  '🎉': { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#4facfe' },
}

const DEFAULT_THEME = {
  gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  accent: '#a18cd1',
}

const STAGE_LABELS: Record<string, string> = {
  [PrototypeStage.WIP]: 'In Progress',
  [PrototypeStage.MVP]: 'MVP',
  [PrototypeStage.Standalone]: 'Live',
}

export const ProjectCard = ({ prototype, index }: { prototype: Prototype; index: number }) => {
  const { user } = useUser()
  const { path, name, description, icon, stage, tech, permittedRoles } = prototype

  const disableRbac = process.env.NEXT_PUBLIC_DISABLE_RBAC === 'true'

  const hasAccess =
    disableRbac ||
    !permittedRoles ||
    permittedRoles.length === 0 ||
    (user?.roles && permittedRoles.some((requiredRole) => user.roles.includes(requiredRole)))

  const theme = CARD_THEMES[icon] || DEFAULT_THEME

  // Strip emoji prefix from name for cleaner display
  const cleanName = name.replace(/^[^\s]+\s/, '')

  const techTags = tech.split(',').map((t) => t.trim())

  const cardContent = (
    <motion.div
      className={hasAccess ? styles.card : styles.cardLocked}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={hasAccess ? { y: -6, transition: { duration: 0.25 } } : undefined}
    >
      {/* Gradient accent strip */}
      <div className={styles.accentStrip} style={{ background: theme.gradient }} />

      <div className={styles.cardInner}>
        {/* Header: icon + stage badge */}
        <div className={styles.cardHeader}>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.stageBadge} data-stage={stage}>
            {STAGE_LABELS[stage] || stage}
          </span>
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>{cleanName}</h3>

        {/* Description */}
        <p className={styles.cardDescription}>{description}</p>

        {/* Tech tags */}
        <div className={styles.techTags}>
          {techTags.map((tag) => (
            <span key={tag} className={styles.techTag}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cardFooter}>
          {hasAccess ? (
            <span className={styles.cta}>
              Explore
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={styles.ctaArrow}
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : (
            <span className={styles.lockedLabel}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a4 4 0 0 0-4 4v2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm2.5 6H5.5V5a2.5 2.5 0 1 1 5 0v2z" />
              </svg>
              Coming Soon
            </span>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      {hasAccess && <div className={styles.glowEffect} style={{ background: theme.accent }} />}
    </motion.div>
  )

  if (hasAccess) {
    return (
      <Link href={path} className={styles.cardLink}>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
