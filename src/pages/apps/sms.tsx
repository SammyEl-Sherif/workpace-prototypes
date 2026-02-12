import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { Sms } from '@/modules/Sms'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const SmsPage = () => {
  return (
    <>
      <DocumentTitle title="Chief of Staff" />
      <Sms />
    </>
  )
}

export default SmsPage
