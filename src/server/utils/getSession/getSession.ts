import { GetServerSidePropsContext } from 'next'
import { getServerSession, Session } from 'next-auth'
import { getAuthOptions } from '../getAuthOptions'
import { SessionAccount } from '@/interfaces/user'

export const getSession = async (
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
) => {
  // return (await getServerSession(req, res, getAuthOptions())) as
  //   | (Session & { account?: SessionAccount })
  //   | null
}
