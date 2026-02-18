import { useState } from 'react'

import { GetServerSideProps } from 'next'
import Link from 'next/link'

import { Button, Text } from '@workpace/design-system'

import { ConsultationModal } from '@/components/ConsultationModal'
import { DefaultLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { WorkpaceApps } from '@/layout/pages'
import { Routes } from '@/interfaces/routes'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

import styles from './integrations.module.scss'

const ButtonComponent = Button as any

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const IntegrationsPage = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const openConsultation = () => setIsConsultationOpen(true)
  const closeConsultation = () => setIsConsultationOpen(false)

  return (
    <>
      <DocumentTitle title="Integrations" />
      <DefaultLayout
        title="Integrations"
        subtitle="Products designed to bring a change of pace to your online workspace."
        headerAction={
          <ButtonComponent variant="default-primary" onClick={openConsultation}>
            Schedule a Consultation
          </ButtonComponent>
        }
      >
        <div className={styles.banner}>
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
                Connect your Notion workspace with our integrations — no setup required. Need
                something custom? We&apos;ll build it.
              </Text>
            </div>
            <Link href={Routes.TEMPLATES} className={styles.bannerLink}>
              <Button as="span" variant="default-secondary" className={styles.bannerButton}>
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>

        <WorkpaceApps />
      </DefaultLayout>

      <ConsultationModal isOpen={isConsultationOpen} onClose={closeConsultation} />
    </>
  )
}

export default IntegrationsPage
