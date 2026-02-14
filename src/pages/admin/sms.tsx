import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { AdminSms } from '@/modules/AdminSms'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const AdminSmsPage = () => {
  return (
    <>
      <DocumentTitle title="Admin SMS" />
      <PageHeader
        title="SMS Management"
        subtitle="View inbound messages and send SMS notifications"
      />
      <AdminSms />
    </>
  )
}

export default AdminSmsPage
