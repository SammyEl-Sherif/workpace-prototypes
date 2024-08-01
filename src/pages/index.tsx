import { DocumentTitle } from '@/layout/DocumentTitle'
import LandingPage from '@/layout/pages/LandingPage/LandingPage'

import MainLayout from '../layout/MainLayout'

export default function HomePage() {
  return (
    <>
      <MainLayout>
        <DocumentTitle title="Landing Page" />
        <LandingPage />
      </MainLayout>
    </>
  )
}
