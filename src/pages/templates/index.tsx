import { useState } from 'react'

import { Button } from '@workpace/design-system'

import { ConsultationModal } from '@/components/ConsultationModal'
import { DefaultLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { Templates } from '@/modules/Templates'

const ButtonComponent = Button as any

const TemplatesPage = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const openConsultation = () => setIsConsultationOpen(true)
  const closeConsultation = () => setIsConsultationOpen(false)

  return (
    <>
      <DocumentTitle title="Notion Templates — WorkPace" />
      <DefaultLayout
        dark
        title="Notion Templates"
        subtitle="Notion templates to change the pace of how you organize work and life."
        headerAction={
          <ButtonComponent variant="default-primary" onClick={openConsultation}>
            Schedule a Consultation
          </ButtonComponent>
        }
      >
        <Templates />
      </DefaultLayout>

      <ConsultationModal isOpen={isConsultationOpen} onClose={closeConsultation} />
    </>
  )
}

export default TemplatesPage
