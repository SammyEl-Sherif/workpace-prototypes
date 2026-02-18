import { GetServerSideProps } from 'next'

import { DefaultLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { About } from '@/modules/About'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const AboutPage = () => {
  return (
    <>
      <DocumentTitle title="About" />
      <DefaultLayout
        title="About"
        subtitle="Explore the design system, system architecture, and the developer behind WorkPace"
      >
        <About />
      </DefaultLayout>
    </>
  )
}

export default AboutPage
