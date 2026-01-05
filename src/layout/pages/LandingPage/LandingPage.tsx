import { LandingNavbar } from './components/LandingNavbar'
import { FooterSection } from './sections/FooterSection'
import { HeroSection } from './sections/HeroSection'
import { ProjectsGrid } from '@/modules'

interface LandingPageProps {
  prototypes?: unknown // Prototypes are now accessed via context in ProjectsGrid
}

const LandingPage = () => {
  return (
    <div>
      <LandingNavbar />
      <HeroSection />
      <section
        id="prototypes"
        style={{ padding: '80px 5px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}
      >
        <ProjectsGrid />
      </section>
      {/* <CommunitySection /> */}
      {/* <TestimonialsSection /> */}
      <FooterSection />
    </div>
  )
}

export default LandingPage
