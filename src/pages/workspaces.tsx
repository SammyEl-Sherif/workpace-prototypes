import { useState } from 'react'

import { Button, Text } from '@workpace/design-system'

import { ConsultationModal } from '@/components/ConsultationModal'
import { DefaultLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import styles from './workspaces.module.scss'

const ButtonComponent = Button as any

const WorkspacesPage = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const openConsultation = () => setIsConsultationOpen(true)
  const closeConsultation = () => setIsConsultationOpen(false)

  return (
    <>
      <DocumentTitle title="Custom Workspaces" />
      <DefaultLayout
        dark
        title="Custom Workspaces"
        subtitle="Notion consulting and custom workspace builds tailored to your team"
        headerAction={
          <ButtonComponent variant="default-primary" onClick={openConsultation}>
            Schedule a Consultation
          </ButtonComponent>
        }
      >
        <div className={styles.ctaBanner}>
          <Text as="h2" variant="headline-md" className={styles.ctaTitle}>
            Let Us Build Your Perfect Workspace
          </Text>
          <Text as="p" variant="body-lg-paragraph" className={styles.ctaSubtitle}>
            From Notion setups to fully custom software solutions, our team will design and build a
            workspace tailored to how your team actually works.
          </Text>
          <ButtonComponent variant="default-primary" onClick={openConsultation}>
            Schedule a Consultation →
          </ButtonComponent>
          <Text as="p" variant="body-sm" className={styles.ctaDisclaimer}>
            No commitment required. Let&apos;s chat about your needs.
          </Text>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Text as="h3" variant="headline-sm" className={styles.sectionTitle}>
                Notion Experts, Software Engineers
              </Text>
              <Text as="p" variant="body-lg-paragraph" className={styles.sectionDescription}>
                We&apos;re not just Notion consultants — we&apos;re a team of software engineers who
                happen to be Notion experts. That means your workspace isn&apos;t limited to
                what&apos;s possible out of the box.
              </Text>
            </div>

            <div className={styles.valueGrid}>
              <div className={styles.valueCard}>
                <Text as="h4" variant="body-lg-emphasis" className={styles.valueTitle}>
                  Custom Notion Builds
                </Text>
                <Text as="p" variant="body-md-paragraph" className={styles.valueDescription}>
                  Databases, dashboards, workflows, and automations designed around how your team
                  actually operates — not generic templates.
                </Text>
              </div>

              <div className={styles.valueCard}>
                <Text as="h4" variant="body-lg-emphasis" className={styles.valueTitle}>
                  Software-Backed Solutions
                </Text>
                <Text as="p" variant="body-md-paragraph" className={styles.valueDescription}>
                  When Notion alone isn&apos;t enough, we build custom integrations, APIs, and tools
                  that extend your workspace with real software.
                </Text>
              </div>

              <div className={styles.valueCard}>
                <Text as="h4" variant="body-lg-emphasis" className={styles.valueTitle}>
                  End-to-End Delivery
                </Text>
                <Text as="p" variant="body-md-paragraph" className={styles.valueDescription}>
                  From initial consulting through build, testing, and handoff — we own the entire
                  process so you get a workspace that&apos;s ready to use on day one.
                </Text>
              </div>
            </div>
          </section>
        </div>
      </DefaultLayout>

      <ConsultationModal isOpen={isConsultationOpen} onClose={closeConsultation} />
    </>
  )
}

export default WorkspacesPage
