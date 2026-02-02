import { GetServerSideProps, NextPage } from 'next'

import { SupabaseAuth } from '@/components/SupabaseAuth'

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
})

const Signin: NextPage = () => {
  return <SupabaseAuth defaultMode="signin" />
}

export default Signin
