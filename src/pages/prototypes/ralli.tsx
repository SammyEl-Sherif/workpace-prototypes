import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { Ralli } from '@/modules/Ralli'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const RalliPage = () => {
  return (
    <>
      <DocumentTitle title="Ralli" />
      <Ralli />
    </>
  )
}

export default RalliPage
