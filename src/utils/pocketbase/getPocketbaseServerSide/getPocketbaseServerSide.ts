import PocketBase from 'pocketbase'

const POCKET_BASE_URL = 'http://127.0.0.1:8090'

// Create a singleton instance
const PocketbaseServerSide = new PocketBase(POCKET_BASE_URL)

PocketbaseServerSide.autoCancellation(false)

const initializePocketbaseClient = async () => {
  try {
    const authData = await PocketbaseServerSide.collection('_superusers').authWithPassword(
      process.env.PB_ADMIN_USERNAME ?? '',
      process.env.PB_ADMIN_PASSWORD ?? ''
    )
  } catch (error) {}
}

initializePocketbaseClient()

export default PocketbaseServerSide
