import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@workpace/design-system'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Routes } from '@/interfaces/routes'

import styles from './HeroSection.module.scss'

const ButtonComponent = Button as any

const subtitles = [
  'Change Your Pace',
  'A Change of Pace',
  'A change of pace in your online workspace',
]

const COMPANIES = [
  'Apple',
  'Google',
  'Notion',
  'Stripe',
  'Figma',
  'Slack',
  'Spotify',
  'Airbnb',
  'Netflix',
  'Linear',
  'Vercel',
  'Shopify',
]

const FEATURES = [
  {
    title: 'Prototypes',
    description: 'Rapidly built applications that solve real problems and test new ideas.',
    href: Routes.PROTOTYPES,
  },
  {
    title: 'Notion Templates',
    description: 'Notion templates to change the pace of how you organize work and life.',
    href: Routes.TEMPLATES,
  },
  {
    title: 'System Design',
    description: 'Architectural patterns and infrastructure decisions at scale.',
    href: Routes.SYSTEM_DESIGN,
  },
]

/* ── Easing helpers ── */

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

/* ─────────────────────────────────────────────────────────────────────────── */

const HeroSection = () => {
  const router = useRouter()
  const [subtitle, setSubtitle] = useState(subtitles[0])

  const fixedRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)])
  }, [])

  /* ── Scroll handler — drives every animation via CSS custom properties ── */

  const handleScroll = useCallback(() => {
    if (!fixedRef.current || !spacerRef.current || !cardsRef.current) return

    const spacerRect = spacerRef.current.getBoundingClientRect()
    const viewH = window.innerHeight

    // progress: 0 at page top → 1 when fully scrolled through the spacer
    const scrolled = Math.max(0, -spacerRect.top)
    const progress = Math.min(1, scrolled / viewH)

    // ── Hero content: fade out + push up (0 → 30 %) ──
    const heroFade = Math.max(0, 1 - progress / 0.3)
    const heroPush = easeOutCubic(Math.min(1, progress / 0.4)) * -120

    // ── Rectangle expansion: 0 → 100 % of scroll ──
    const rectEased = easeInOutCubic(progress)

    // ── Dark-mode transition: 0 → 65 % ──
    const darkRaw = Math.max(0, Math.min(1, progress / 0.65))
    const darkProgress = easeInOutCubic(darkRaw)

    // ── Card entrance: 50 → 100 % (cards appear as rect nears full screen) ──
    const cardRaw = Math.max(0, Math.min(1, (progress - 0.5) / 0.5))
    const cardProgress = easeOutCubic(cardRaw)

    // Interpolated page colours
    const bgVal = lerp(255, 26, darkProgress) // #fff → #1a1a1a
    const textVal = lerp(25, 255, darkProgress) // #191919 → #fff
    const borderAlpha = (0.1 * (1 - darkProgress)).toFixed(3)

    // Page-level CSS vars (navbar also reads these)
    const root = document.documentElement
    root.style.setProperty('--page-bg', `rgb(${bgVal},${bgVal},${bgVal})`)
    root.style.setProperty('--page-text', `rgb(${textVal},${textVal},${textVal})`)
    root.style.setProperty('--page-border', `rgba(${textVal},${textVal},${textVal},${borderAlpha})`)
    root.style.setProperty('--dark-progress', String(darkProgress))

    // Fixed hero animation
    const hero = fixedRef.current
    hero.style.setProperty('--hero-opacity', String(heroFade))
    hero.style.setProperty('--hero-push', `${heroPush}px`)
    hero.style.setProperty('--rect-progress', String(rectEased))
    hero.style.setProperty('--hero-events', heroFade > 0.1 ? 'auto' : 'none')

    // Card animation (applied to the cards wrapper)
    const cards = cardsRef.current
    cards.style.setProperty('--card-opacity', String(cardProgress))
    cards.style.setProperty('--card-translate', `${(1 - cardProgress) * 50}px`)
    cards.style.setProperty('--card-scale', String(0.88 + 0.12 * cardProgress))

    // Once the cards section fully covers the viewport, hide the fixed hero
    // for performance and to prevent stale pointer-events
    const cardsTop = cardsRef.current.getBoundingClientRect().top
    hero.style.visibility = cardsTop <= 0 ? 'hidden' : 'visible'
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // set initial state
    return () => {
      window.removeEventListener('scroll', handleScroll)
      const root = document.documentElement
      root.style.removeProperty('--page-bg')
      root.style.removeProperty('--page-text')
      root.style.removeProperty('--page-border')
      root.style.removeProperty('--dark-progress')
    }
  }, [handleScroll])

  /* ── Render ── */

  return (
    <>
      {/* ─── Fixed hero layer (stays in place, animates on scroll) ─── */}
      <div className={styles.fixedHero} ref={fixedRef}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>WorkPace</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.cta}>
            <ButtonComponent
              onClick={() => router.push(Routes.PROTOTYPES)}
              variant="brand-secondary"
            >
              Our Products
            </ButtonComponent>
            <ButtonComponent
              onClick={() => router.push(Routes.SYSTEM_DESIGN)}
              variant="default-secondary"
            >
              System Design
            </ButtonComponent>
          </div>
        </div>

        {/* Dark rectangle — expands from a bar to full-screen */}
        <div className={styles.showcaseRectangle}>
          <div className={styles.companyLogos}>
            {/* Two identical tracks for seamless loop */}
            <div className={styles.companyTrack}>
              {[...COMPANIES, ...COMPANIES].map((name, i) => (
                <span key={`a-${i}`} className={styles.companyName}>
                  {name}
                </span>
              ))}
            </div>
            <div className={styles.companyTrack}>
              {[...COMPANIES, ...COMPANIES].map((name, i) => (
                <span key={`b-${i}`} className={styles.companyName}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scroll spacer — creates the scrollable distance for the animation ─── */}
      <div className={styles.scrollSpacer} ref={spacerRef} />

      {/* ─── Cards section — scrolls up naturally over the fixed hero ─── */}
      <div className={styles.cardsSection} ref={cardsRef}>
        <div className={styles.cardsInner}>
          <h2 className={styles.cardsHeading}>What We Build</h2>
          <div className={styles.cardsGrid}>
            {FEATURES.map((feature) => (
              <Link key={feature.title} href={feature.href} className={styles.card}>
                <div className={styles.cardImage} />
                <div className={styles.cardOverlay} />
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{feature.title}</h3>
                  <p className={styles.cardDesc}>{feature.description}</p>
                  <span className={styles.cardBtn}>Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroSection
