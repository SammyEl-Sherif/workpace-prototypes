import cn from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Text } from '@workpace/design-system'

import { CommunityMember } from '@/apis/controllers/members'

import { useScrollReveal } from '../../hooks'

import styles from './CommunitySection.module.scss'

interface Pillar {
  icon: string
  title: string
  description: string
}

const pillars: Pillar[] = [
  {
    icon: '📝',
    title: 'Notion Teamspace',
    description:
      'Explore articles, blogs, notes, and even Notion Agent Templates made by members specializing in a range of industries.',
  },
  {
    icon: '💬',
    title: 'Slack Community',
    description:
      'Chat with others, get help, share wins, and stay connected with a group of motivated individuals.',
  },
  {
    icon: '🤝',
    title: 'Collaborative Workspace',
    description:
      'Work alongside others looking to maximize their workspace for pursuing their goals.',
  },
]

const LOCATION_BACKGROUNDS: Record<string, string> = {
  'San Francisco': '/golden-gate-bridge-bay-sunset.jpg.webp',
  Chicago: '/Hero_Best-Skyline-Views.jpg',
}

const DEFAULT_BACKGROUND = '/office_image.jpg'

const getBackgroundForLocation = (location: string | null): string => {
  if (!location) return DEFAULT_BACKGROUND
  return LOCATION_BACKGROUNDS[location] ?? DEFAULT_BACKGROUND
}

const formatJoinedDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const ROTATION_INTERVAL = 10_000
const FADE_DURATION = 600

const CommunitySection = () => {
  const { ref, isVisible } = useScrollReveal()
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [bgFront, setBgFront] = useState(DEFAULT_BACKGROUND)
  const [bgBack, setBgBack] = useState(DEFAULT_BACKGROUND)
  const [frontVisible, setFrontVisible] = useState(true)
  const isTransitioning = useRef(false)

  useEffect(() => {
    fetch('/api/members')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembers(data)
          if (data.length > 0) {
            const bg = getBackgroundForLocation(data[0].location)
            setBgFront(bg)
            setBgBack(bg)
          }
        }
      })
      .catch(() => {})
  }, [])

  const transitionTo = useCallback(
    (nextIndex: number) => {
      if (isTransitioning.current || members.length <= 1) return
      isTransitioning.current = true

      const nextBg = getBackgroundForLocation(members[nextIndex]?.location ?? null)

      // Set the next image on the hidden layer, then crossfade
      if (frontVisible) {
        setBgBack(nextBg)
      } else {
        setBgFront(nextBg)
      }

      // Start fading card out + crossfade background
      setIsFading(true)
      setFrontVisible((prev) => !prev)

      setTimeout(() => {
        setActiveIndex(nextIndex)
        setIsFading(false)
        isTransitioning.current = false
      }, FADE_DURATION)
    },
    [members, frontVisible]
  )

  const rotateMember = useCallback(() => {
    if (members.length <= 1) return
    const nextIndex = (activeIndex + 1) % members.length
    transitionTo(nextIndex)
  }, [members.length, activeIndex, transitionTo])

  useEffect(() => {
    if (members.length <= 1) return
    const timer = setInterval(rotateMember, ROTATION_INTERVAL)
    return () => clearInterval(timer)
  }, [members.length, rotateMember])

  const activeMember = members[activeIndex] ?? null

  return (
    <section id="community" className={styles.section} ref={ref}>
      <div
        className={cn(styles.bgLayer, { [styles.bgVisible]: frontVisible })}
        style={{ backgroundImage: `url(${bgFront})` }}
      />
      <div
        className={cn(styles.bgLayer, { [styles.bgVisible]: !frontVisible })}
        style={{ backgroundImage: `url(${bgBack})` }}
      />
      <div className={styles.overlay} />

      <div className={styles.container}>
        <div className={styles.columns}>
          <div className={cn(styles.leftColumn, styles.reveal, { [styles.visible]: isVisible })}>
            <Text variant="headline-lg" as="h2" className={styles.title}>
              Join the WorkPace Community
            </Text>
            <Text variant="body-lg" as="p" className={styles.subtitle}>
              A space for motivated people to come together, share knowledge, and chase their goals
              with a group of like-minded individuals.
            </Text>

            <ul className={styles.pillarList}>
              {pillars.map((pillar) => (
                <li key={pillar.title} className={styles.pillarItem}>
                  <span className={styles.pillarIcon}>{pillar.icon}</span>
                  <div>
                    <Text variant="body-md-emphasis" as="span" className={styles.pillarTitle}>
                      {pillar.title}
                    </Text>
                    <Text variant="body-sm" as="span" className={styles.pillarDescription}>
                      {pillar.description}
                    </Text>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.cta}>
              <a
                href="https://www.notion.so/team/join"
                className={cn(styles.ctaButton, styles.ctaPrimary)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Notion Teamspace
              </a>
              <a
                href="https://slack.com"
                className={cn(styles.ctaButton, styles.ctaSecondary)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Slack
              </a>
            </div>
          </div>

          <div
            className={cn(styles.rightColumn, styles.reveal, { [styles.visible]: isVisible })}
            style={{ transitionDelay: '200ms' }}
          >
            {activeMember && (
              <div className={cn(styles.memberCard, { [styles.memberFading]: isFading })}>
                {activeMember.coverImage && (
                  <div className={styles.memberImageWrapper}>
                    <img
                      src={activeMember.coverImage}
                      alt={activeMember.name}
                      className={styles.memberImage}
                    />
                  </div>
                )}
                <div className={styles.memberInfo}>
                  <Text variant="body-md-emphasis" as="h4" className={styles.memberName}>
                    {activeMember.name}
                  </Text>
                  {activeMember.jobTitle && (
                    <Text variant="body-sm" as="p" className={styles.memberJobTitle}>
                      {activeMember.jobTitle}
                    </Text>
                  )}
                  {activeMember.location && (
                    <span className={styles.memberLocation}>📍 {activeMember.location}</span>
                  )}
                  {activeMember.joined && (
                    <span className={styles.memberJoined}>
                      Member since {formatJoinedDate(activeMember.joined)}
                    </span>
                  )}
                  {activeMember.linkedIn && (
                    <a
                      href={activeMember.linkedIn}
                      className={styles.memberLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            {members.length > 1 && (
              <div className={styles.memberDots}>
                {members.map((_, i) => (
                  <button
                    key={members[i].id}
                    className={cn(styles.dot, { [styles.dotActive]: i === activeIndex })}
                    onClick={() => {
                      if (i === activeIndex) return
                      transitionTo(i)
                    }}
                    aria-label={`Show member ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunitySection
