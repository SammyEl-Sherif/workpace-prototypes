import React from 'react'
import { Text } from '@workpace/design-system'
import { GetServerSideProps } from 'next'
import { withPageRequestWrapper } from '@/server/utils/withPageRequestWrapper'
import { ButtonWithModalDialog } from '@/components'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async (context) => {
  return {}
})

const RerenderBlogPage = () => {
  return (
    <div>
      <Text as="div" variant={'headline-lg-emphasis'}>
        Rerender blog page
      </Text>
      <ButtonWithModalDialog>
        <Text>Modal content!</Text>
      </ButtonWithModalDialog>
    </div>
  )
}

export default RerenderBlogPage
