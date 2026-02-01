import { LandingNavbar } from './components/LandingNavbar'
import { FeaturesSection } from './sections/FeaturesSection'
import { HeroSection } from './sections/HeroSection'
import { PrototypesSection } from './sections/PrototypesSection'

import { usePrototypesContext } from '@/modules/WorkpacePrototypes/contexts'

const LandingPage = () => {
  const { prototypes } = usePrototypesContext()

  return (
    <>
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <PrototypesSection prototypes={prototypes || []} />
    </>
  )
}

export default LandingPage
