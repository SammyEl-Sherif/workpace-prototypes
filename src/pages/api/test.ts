import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log important environment variables to Vercel function logs
  console.log('=== API Test Route - Environment Variables ===')
  console.log('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET')
  console.log('  AUTH0_ISSUER_BASE_URL:', process.env.AUTH0_ISSUER_BASE_URL || 'NOT SET')
  console.log('  AUTH0_SCOPE:', process.env.AUTH0_SCOPE || 'NOT SET')
  console.log('  AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE || 'NOT SET')
  console.log('  NODE_ENV:', process.env.NODE_ENV)
  console.log('  HOST:', process.env.HOST || 'NOT SET')
  console.log('=== End Environment Variables ===')

  res.status(200).json({
    message: 'API route is working!',
    envCheck: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : 'NOT SET',
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL ? 'SET' : 'NOT SET',
      AUTH0_SCOPE: process.env.AUTH0_SCOPE ? 'SET' : 'NOT SET',
      AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      HOST: process.env.HOST || 'NOT SET',
    },
  })
}
