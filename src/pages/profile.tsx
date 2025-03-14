import React from 'react'

import { GetServerSideProps } from 'next'

import { Prototype } from '@/interfaces/prototypes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import { ProfilePage } from '@/layout/pages/ProfilePage'
import { PrototypesContextProvider } from '@/modules'
import { getPrototypesMetadata } from '@/server/utils'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

type ProfileProps = {
  prototypes: Prototype[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const prototypes = getPrototypesMetadata()
  return {
    prototypes,
  }
})

const Profile = ({ prototypes }: ProfileProps) => {
  return (
    <PrototypesContextProvider prototypes={prototypes}>
      <MainLayout>
        <DocumentTitle title="About" />
        <ProfilePage />
      </MainLayout>
    </PrototypesContextProvider>
  )
}

export default Profile
