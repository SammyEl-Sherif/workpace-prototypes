import fs from 'fs'
import path from 'path'

import React from 'react'

import { GetServerSideProps } from 'next'

import { Prototype, PrototypeMeta } from '@/interfaces/prototypes'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import { WorkpaceProjects } from '@/layout/pages'
import { PrototypesContextProvider } from '@/modules'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'



type WorkPaceProjectsPageProps = {
  prototypes: Prototype[]
}

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  const prototypesDir = path.join(process.cwd(), 'pages/prototypes')
  const files = fs.readdirSync(prototypesDir)

  const prototypes = files.map((file) => {
    const name = file
      .replace('.tsx', '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    const path = `prototypes/${file.replace('.tsx', '')}` as keyof typeof PrototypeMeta
    const description = PrototypeMeta[path as keyof typeof PrototypeMeta]

    console.log(
      `Processing file: ${file}, Name: ${name}, Path: ${path}, Description: ${description}`
    )

    return {
      name,
      path: `/${path}`,
      description,
    }
  })

  return {
    prototypes,
  }
})

const WorkPaceProjectsPage = ({ prototypes }: WorkPaceProjectsPageProps) => {
  return (
    <PrototypesContextProvider prototypes={prototypes}>
      <MainLayout>
        <DocumentTitle title="Home" />
        <WorkpaceProjects />
      </MainLayout>
    </PrototypesContextProvider>
  )
}

export default WorkPaceProjectsPage
