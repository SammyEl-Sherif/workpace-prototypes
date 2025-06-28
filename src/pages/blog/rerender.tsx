import React from 'react'
import { GetServerSideProps } from 'next'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  return {}
})

const RerenderBlogPage = () => {
  return <>Rerender blog page</>
}

export default RerenderBlogPage
