import { useState } from 'react'

import { Button, Text } from '@workpace/design-system'
import Link from 'next/link'

import { ConsultationModal } from '@/components/ConsultationModal'
import { PageBanner } from '@/components/PageBanner'
import { Routes } from '@/interfaces/routes'
import { DefaultLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'

import styles from './workspaces.module.scss'

const ButtonComponent = Button as any

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Free Consultation Call',
    description:
      'We start with a no-commitment call to understand your goals, pain points, and what your ideal workspace looks like. This is where we define the scope of our engagement together.',
  },
  {
    number: '02',
    title: 'Weekly Deep-Dives',
    description:
      'Once we kick off, we meet weekly to dive into the details of your problem space. Every session gets us closer to a workspace that fits the way you actually work.',
  },
  {
    number: '03',
    title: 'Build, Ship, Repeat',
    description:
      'We work on one feature or request at a time with a guaranteed 48-hour turnaround. Unlimited requests and updates, all included in a simple monthly subscription.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Head of Operations',
    company: 'Meridian Labs',
    quote:
      'WorkPace completely transformed how our 30-person team manages projects. We went from scattered Google Docs to a centralized Notion hub in under two weeks. The weekly check-ins made sure everything was dialed in to exactly how we operate.',
  },
  {
    name: 'James Okafor',
    role: 'Founder',
    company: 'Okafor Creative',
    quote:
      'As a solo creative, I needed a system that could handle client intake, project tracking, and invoicing all in one place. The WorkPace team built exactly that. The 48-hour turnaround on changes is no joke.',
  },
  {
    name: 'Maria Gonzalez',
    role: 'VP of Engineering',
    company: 'NovaTech Solutions',
    quote:
      'We needed custom integrations between Notion and our internal tools. Most consultants would have said "that is not possible." WorkPace built it in a week. Having software engineers who actually understand Notion is a game changer.',
  },
]

const WorkspacesPage = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const openConsultation = () => setIsConsultationOpen(true)
  const closeConsultation = () => setIsConsultationOpen(false)

  return (
    <>
      <DocumentTitle title="Custom Workspaces — WorkPace" />
      <DefaultLayout
        dark
        title="Custom Workspaces"
        subtitle="When templates and agents are not enough, we build it for you."
        headerAction={
          <ButtonComponent variant="brand-secondary" onClick={openConsultation}>
            Schedule a Consultation
          </ButtonComponent>
        }
      >
        {/* ── Trust Banner ── */}
        <PageBanner
          logos={{ left: 'W', right: 'N' }}
          title="Built by professional software engineers"
          subtitle="Every template, agent, and custom workspace is designed and built by experienced engineers who live and breathe Notion."
          ctaLabel="Browse Templates"
          ctaHref={Routes.TEMPLATES}
        />

        {/* ── Start with What People Love ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text as="h2" variant="headline-md" className={styles.sectionTitle}>
              Start with Templates and Agents
            </Text>
            <Text as="p" variant="body-lg-paragraph" className={styles.sectionDescription}>
              Before going custom, explore our library of ready-made solutions. Many teams find
              exactly what they need without a single line of custom work.
            </Text>
          </div>

          <div className={styles.linkGrid}>
            <Link href={Routes.AGENTS} className={styles.linkCard}>
              <div className={styles.linkCardIcon}>🤖</div>
              <div className={styles.linkCardContent}>
                <Text as="h3" variant="body-lg-emphasis" className={styles.linkCardTitle}>
                  AI Agents
                </Text>
                <Text as="p" variant="body-md-paragraph" className={styles.linkCardDescription}>
                  AI-powered agents that automate repetitive workflows so you can focus on the work
                  that matters.
                </Text>
              </div>
            </Link>

            <Link href={Routes.TEMPLATES} className={styles.linkCard}>
              <div className={styles.linkCardIcon}>📄</div>
              <div className={styles.linkCardContent}>
                <Text as="h3" variant="body-lg-emphasis" className={styles.linkCardTitle}>
                  Notion Templates
                </Text>
                <Text as="p" variant="body-md-paragraph" className={styles.linkCardDescription}>
                  Pre-built Notion templates you can duplicate and customize. Free and premium options
                  available.
                </Text>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Need Something Custom? ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text as="h2" variant="headline-md" className={styles.sectionTitle}>
              Custom Workspaces, Built for You
            </Text>
            <Text as="p" variant="body-lg-paragraph" className={styles.sectionDescription}>
              Our custom workspace service is a monthly subscription that gives you unlimited feature
              requests and updates. One request at a time, with a guaranteed 48-hour turnaround.
            </Text>
          </div>

          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className={styles.processCard}>
                <span className={styles.processNumber}>{step.number}</span>
                <Text as="h3" variant="body-lg-emphasis" className={styles.processTitle}>
                  {step.title}
                </Text>
                <Text as="p" variant="body-md-paragraph" className={styles.processDescription}>
                  {step.description}
                </Text>
              </div>
            ))}
          </div>

          <div className={styles.ctaBanner}>
            <Text as="h3" variant="headline-sm" className={styles.ctaTitle}>
              Ready to get started?
            </Text>
            <Text as="p" variant="body-md-paragraph" className={styles.ctaSubtitle}>
              Book a free consultation call. No commitment required.
            </Text>
            <ButtonComponent variant="brand-secondary" onClick={openConsultation}>
              Schedule a Consultation
            </ButtonComponent>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Text as="h2" variant="headline-md" className={styles.sectionTitle}>
              What Our Clients Say
            </Text>
          </div>

          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.name} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>&ldquo;{testimonial.quote}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {testimonial.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <Text as="p" variant="body-md-emphasis" className={styles.testimonialName}>
                      {testimonial.name}
                    </Text>
                    <Text as="p" variant="body-sm" className={styles.testimonialRole}>
                      {testimonial.role}, {testimonial.company}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </DefaultLayout>

      <ConsultationModal isOpen={isConsultationOpen} onClose={closeConsultation} />
    </>
  )
}

export default WorkspacesPage
