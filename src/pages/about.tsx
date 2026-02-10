import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { About } from '@/modules/About'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const AboutPage = () => {
  return (
    <>
      <DocumentTitle title="About" />
      <PageHeader
        title="About"
        subtitle="Explore the design system, system architecture, and the developer behind WorkPace"
      />
      <About />
    </>
  )
}

export default AboutPage
