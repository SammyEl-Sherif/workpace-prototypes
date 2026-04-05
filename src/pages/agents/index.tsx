import { useState } from 'react'

import { Button } from '@workpace/design-system'

import { ConsultationModal } from '@/components/ConsultationModal'
import { DefaultLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { Agents } from '@/modules/Agents'

const ButtonComponent = Button as any

const AgentsPage = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const openConsultation = () => setIsConsultationOpen(true)
  const closeConsultation = () => setIsConsultationOpen(false)

  return (
    <>
      <DocumentTitle title="AI Agents — WorkPace" />
      <DefaultLayout
        dark
        title="AI Agents"
        subtitle="AI agents that handle the busy work so you can focus on what matters."
        headerAction={
          <ButtonComponent variant="brand-secondary" onClick={openConsultation}>
            Schedule a Consultation
          </ButtonComponent>
        }
      >
        <Agents />
      </DefaultLayout>

      <ConsultationModal isOpen={isConsultationOpen} onClose={closeConsultation} />
    </>
  )
}

export default AgentsPage
