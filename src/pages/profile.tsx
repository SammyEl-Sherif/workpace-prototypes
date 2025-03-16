import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { ProfilePage } from '@/layout/pages/ProfilePage'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const Profile = () => {
  return (
    <>
      <DocumentTitle title="About" />
      <ProfilePage />
    </>
  )
}

export default Profile
