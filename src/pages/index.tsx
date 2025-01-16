import React from 'react'

import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import { WorkpaceProjects } from '@/layout/pages'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export interface HomePageProps {
  projects: string[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const projects = ['http://localhost:3000/good-stuff-list', 'idea2', 'idea3', 'idea4']

  return {
    projects,
  }
})

const HomePage = ({ projects }: HomePageProps) => {
  return (
    <MainLayout>
      <DocumentTitle title="Home" />
      <WorkpaceProjects projects={projects} />
    </MainLayout>
  )
}

export default HomePage
