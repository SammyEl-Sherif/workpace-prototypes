import React, { useState } from 'react'

import { GetServerSideProps } from 'next'
import { FormProvider, useForm } from 'react-hook-form'

import { usePocketbaseLogin } from '@/hooks/usePocketbaseLogin'
import { DocumentTitle } from '@/layout/DocumentTitle'
import MainLayout from '@/layout/MainLayout'
import { SignInForm } from '@/modules/AuthenticationForms'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  return {}
})

const PocketbaseLoginPage = () => {
  return (
    <MainLayout>
      <DocumentTitle title="Login / Sign Up" />
      <SignInForm />
    </MainLayout>
  )
}

export default PocketbaseLoginPage
