import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { BudgetBot } from '@/modules/BudgetBot'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const BudgetBotPage = () => {
  return (
    <>
      <DocumentTitle title="Budget Bot" />
      <BudgetBot />
    </>
  )
}

export default BudgetBotPage
