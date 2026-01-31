import { logout } from '@/apis/routes/auth'
import { NextApiRequest, NextApiResponse } from 'next'

// Logout endpoint needs to handle redirects, so we wrap it manually
// to ensure errors don't prevent the redirect
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await logout(req, res)
  } catch (error) {
    // If there's an error, still try to redirect to signin
    console.error('Error in logout handler:', error)
    const callbackUrl = (req.query.callbackUrl as string) || '/signin?signout=true'
    const baseUrl = process.env.NEXTAUTH_URL || req.headers.origin || `http://${req.headers.host}`
    const fullCallbackUrl = `${baseUrl}${
      callbackUrl.startsWith('/') ? callbackUrl : `/${callbackUrl}`
    }`

    // Only redirect if response hasn't been sent yet
    if (!res.headersSent) {
      res.redirect(fullCallbackUrl)
    }
  }
}
