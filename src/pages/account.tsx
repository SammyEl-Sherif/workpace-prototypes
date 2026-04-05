import { GetServerSideProps } from 'next'

import { DefaultLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { ProfilePage } from '@/layout/pages/ProfilePage'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const AccountPage = () => {
  return (
    <>
      <DocumentTitle title="My Account — WorkPace" />
      <DefaultLayout dark title="My Account" subtitle="Manage your profile and account settings.">
        <ProfilePage />
      </DefaultLayout>
    </>
  )
}

export default AccountPage
