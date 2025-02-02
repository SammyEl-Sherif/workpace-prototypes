import { GetServerSidePropsContext } from 'next'
import PocketBase from 'pocketbase'

type InitPocketBaseProps = {
  request: GetServerSidePropsContext['req']
  response: GetServerSidePropsContext['res']
}

export async function initPocketBase({ request, response }: InitPocketBaseProps) {
  const pb = new PocketBase('http://127.0.0.1:8090')
  return pb
}
