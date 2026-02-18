import { useState } from 'react'

import { useFeatureFlagsContext } from '@/contexts/FeatureFlagsContextProvider'

import { ConsultationModal } from '@/components/ConsultationModal'
import { StandardNavbar } from './components/StandardNavbar'
import { CommunitySection } from './sections/CommunitySection'
import { CTASection } from './sections/CTASection'
import { FooterSection } from './sections/FooterSection'
import { HeroSection } from './sections/HeroSection'
import { ServicesSection } from './sections/ServicesSection'
import { TemplatesSection } from './sections/TemplatesSection'

const LandingPage = () => {
  const { isEnabled } = useFeatureFlagsContext()
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const paymentsEnabled = isEnabled('enable-payments')
  const communityEnabled = isEnabled('enable-community')

  const openConsultation = () => setIsConsultationOpen(true)
  const closeConsultation = () => setIsConsultationOpen(false)

  return (
    <div>
      <StandardNavbar alwaysTransparent />
      <main>
        <HeroSection />
        <ServicesSection />
        {communityEnabled && <CommunitySection />}
        {paymentsEnabled && <TemplatesSection />}
        <CTASection onBookConsultation={openConsultation} />
      </main>
      <FooterSection />
      <ConsultationModal isOpen={isConsultationOpen} onClose={closeConsultation} />
    </div>
  )
}

export default LandingPage
