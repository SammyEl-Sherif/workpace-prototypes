import { useState } from 'react'

import { ConsultationModal } from './components/ConsultationModal'
import { StandardNavbar } from './components/StandardNavbar'
import { CTASection } from './sections/CTASection'
import { FeaturesSection } from './sections/FeaturesSection'
import { FooterSection } from './sections/FooterSection'
import { HeroSection } from './sections/HeroSection'
import { ProcessSection } from './sections/ProcessSection'
import { ServicesSection } from './sections/ServicesSection'
import { TemplatesSection } from './sections/TemplatesSection'

const LandingPage = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const openConsultation = () => setIsConsultationOpen(true)
  const closeConsultation = () => setIsConsultationOpen(false)

  return (
    <div>
      <StandardNavbar transparent />
      <main>
        <HeroSection onBookConsultation={openConsultation} />
        <ServicesSection onBookConsultation={openConsultation} />
        <FeaturesSection />
        <TemplatesSection />
        <ProcessSection />
        <CTASection onBookConsultation={openConsultation} />
      </main>
      <FooterSection />
      <ConsultationModal isOpen={isConsultationOpen} onClose={closeConsultation} />
    </div>
  )
}

export default LandingPage
