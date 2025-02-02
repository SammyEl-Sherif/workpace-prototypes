import PocketBase from 'pocketbase'

const PocketbaseClientSide = new PocketBase(process.env.POCKET_BASE_URL)

export default PocketbaseClientSide
