import { Prototype } from '@/interfaces/prototypes'
import { LandingNavbar } from './components/LandingNavbar'
import { FooterSection } from './sections/FooterSection'
import { HeroSection } from './sections/HeroSection'
import { PrototypesSection } from './sections/PrototypesSection'

interface LandingPageProps {
  prototypes: Prototype[]
}

const LandingPage = ({ prototypes }: LandingPageProps) => {
  return (
    <div>
      <LandingNavbar />
      <HeroSection />
      <PrototypesSection prototypes={prototypes} />
      {/* <CommunitySection /> */}
      {/* <TestimonialsSection /> */}
      <FooterSection />
    </div>
  )
}

export default LandingPage
