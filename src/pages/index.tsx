import { GetServerSideProps } from 'next'

import { Prototype } from '@/interfaces/prototypes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { LandingPage } from '@/layout/pages'
import { getPrototypesMetadata } from '@/server/utils/getPrototypesMetadata/getPrototypesMetadata'

interface HomePageProps {
  prototypes: Prototype[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prototypes = getPrototypesMetadata()

  return {
    props: {
      prototypes,
    },
  }
}

const HomePage = ({ prototypes }: HomePageProps) => {
  return (
    <>
      <DocumentTitle title="WorkPace - A change of pace in your online workspace" />
      <LandingPage prototypes={prototypes} />
    </>
  )
}

export default HomePage
