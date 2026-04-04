import { GetServerSideProps } from 'next'

import { AppPageLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { AdminSms } from '@/modules/AdminSms'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const AdminSmsPage = () => {
  return (
    <>
      <DocumentTitle title="Admin SMS" />
      <AppPageLayout
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'SMS' }]}
        title="SMS Management"
        subtitle="View inbound messages and send SMS notifications"
      >
        <AdminSms />
      </AppPageLayout>
    </>
  )
}

export default AdminSmsPage
