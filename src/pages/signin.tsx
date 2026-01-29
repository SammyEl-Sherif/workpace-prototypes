import { GetServerSideProps, NextPage } from 'next'

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
})

const Signin: NextPage = () => {
  console.log('SIGNIN PAGE', process.env.NEXTAUTH_URL)
  console.log('SIGNIN PAGE', process.env.HOST)
  console.log('SIGNIN PAGE', process.env.NODE_ENV)
  console.log('SIGNIN PAGE', process.env.AUTH0_ISSUER_BASE_URL)
  console.log('SIGNIN PAGE', process.env.AUTH0_SCOPE)
  console.log('SIGNIN PAGE', process.env.AUTH0_AUDIENCE)

  return null
}

export default Signin
