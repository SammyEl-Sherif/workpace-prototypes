# Supabase Authentication Setup

This guide explains how to configure Supabase authentication for the WorkPace application.

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Access to your Supabase project dashboard

## Environment Variables

Add the following environment variables to your `.env.local` file (for local development) or your deployment platform (Vercel, etc.):

### Required Variables

```bash
# Supabase Project URL (found in Project Settings > API)
# ✅ Safe to expose - URL is not sensitive, client needs it to connect
NEXT_PUBLIC_WORKPACE_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Publishable/Anon Key (found in Project Settings > API)
# ✅ Safe to expose - This key is designed to be public
#    It's restricted by Row Level Security (RLS) policies and can only
#    perform actions your RLS policies allow. This is the standard Supabase pattern.
#    Note: "Publishable key" (new format) and "anon key" (legacy) are the same - use either one
NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY=your-publishable-key-or-anon-key-here

# Supabase Service Role Key (found in Project Settings > API)
# ⚠️ SECRET - This key has admin privileges. Never expose it in client-side code!
#    Note: No NEXT_PUBLIC_ prefix means it's server-only
WORKPACE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Where to Find These Values

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. You'll find:
   - **Project URL** → Use for `NEXT_PUBLIC_WORKPACE_SUPABASE_URL` (safe to expose)
   - **Publishable key** (new) or **anon key** (legacy) → Use for `NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY` (safe to expose - designed to be public)
     - **Note**: "Publishable key" and "anon key" are the same thing - Supabase is transitioning to "publishable key" format (`sb_publishable_xxx`), but both work identically
   - **service_role key** → Use for `WORKPACE_SUPABASE_SERVICE_ROLE_KEY` (⚠️ SECRET - server-only, no NEXT_PUBLIC_ prefix)

### Why is the Publishable/Anon Key Public?

The `NEXT_PUBLIC_WORKPACE_SUPABASE_ANON_KEY` (which can be either a "publishable key" or "anon key") is **intentionally public** and safe to expose in client-side code because:

- It's restricted by **Row Level Security (RLS)** policies you define
- It can only perform actions your RLS policies explicitly allow
- It cannot bypass your database security rules
- This is the standard Supabase authentication pattern
- Supabase documentation explicitly states the anon key can be public

The **service_role key** is different - it bypasses RLS and has admin privileges, which is why it must stay server-side only.

## Supabase Project Configuration

### 1. Enable Phone Authentication

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable **Phone** provider
3. Configure your SMS provider (Twilio is recommended):
   - Go to **Settings** > **Auth** > **Phone Auth**
   - Add your Twilio credentials or use Supabase's built-in SMS service

### 2. Enable Email Authentication

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable **Email** provider
3. Configure email settings:
   - Go to **Settings** > **Auth** > **Email Auth**
   - Configure email templates if needed
   - Set up email confirmation (optional but recommended)

### 3. Configure Authentication Settings

1. Go to **Authentication** > **Settings**
2. Configure the following:
   - **Site URL**: Your application URL (e.g., `http://localhost:3000` for local, `https://yourdomain.com` for production)
   - **Redirect URLs**: Add your callback URLs
   - **Enable phone signup**: Enable this if you want users to sign up with phone numbers
   - **Enable email signup**: Enable this if you want users to sign up with email

### 4. Database Setup (Optional)

If you need to store additional user data:

1. Go to **SQL Editor** in your Supabase dashboard
2. Create any additional tables you need for user profiles
3. Set up Row Level Security (RLS) policies as needed

## API Endpoints

The following Supabase authentication endpoints are available:

### Sign Up
- **POST** `/api/auth/supabase/signup`
- **Body**: 
  ```json
  {
    "email": "user@example.com",  // Optional if phone is provided
    "phone": "+1234567890",        // Optional if email is provided
    "password": "password123"      // Required if email is provided
  }
  ```

### Sign In
- **POST** `/api/auth/supabase/signin`
- **Body**: 
  ```json
  {
    "email": "user@example.com",  // Optional if phone is provided
    "phone": "+1234567890",        // Optional if email is provided
    "password": "password123",     // Required for email/password signin
    "otp": "123456"                // Required for phone/email OTP verification
  }
  ```

### Verify OTP
- **POST** `/api/auth/supabase/verify`
- **Body**: 
  ```json
  {
    "phone": "+1234567890",  // Optional if email is provided
    "email": "user@example.com",  // Optional if phone is provided
    "token": "123456",
    "type": "sms"  // or "email"
  }
  ```

### Sign Out
- **POST** `/api/auth/supabase/signout`

## Usage Examples

### Client-Side Usage

```typescript
import { getSupabaseClient } from '@/utils/supabase/client'

// Sign up with email
const supabase = getSupabaseClient()
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign up with phone (passwordless)
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890'
})

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
})
```

### Server-Side Usage

```typescript
import { withSupabaseAuth } from '@/server/utils'
import { createSupabaseServerClient } from '@/server/utils'

// Protected API route
export default withSupabaseAuth(async (req, res, session) => {
  // session.user contains the authenticated user
  // session.accessToken contains the access token
  res.json({ user: session.user })
})

// Direct Supabase client usage
const supabase = createSupabaseServerClient()
const { data } = await supabase.auth.admin.listUsers()
```

## Migration Notes

- **Auth0 code is preserved**: All existing Auth0 authentication code remains in place and functional
- **Coexistence**: Both Auth0 and Supabase authentication can work side-by-side
- **Gradual migration**: You can migrate users gradually from Auth0 to Supabase
- **No breaking changes**: Existing Auth0 routes and functionality are unchanged

## Troubleshooting

### Common Issues

1. **"Missing Supabase configuration" error**
   - Ensure all environment variables are set correctly
   - Check that variable names match exactly (case-sensitive)

2. **OTP not received**
   - Check Supabase dashboard > Authentication > Logs for errors
   - Verify phone number format (include country code, e.g., +1234567890)
   - Check SMS provider configuration in Supabase dashboard

3. **CORS errors**
   - Ensure your site URL is configured in Supabase dashboard
   - Check redirect URLs in Authentication settings

4. **Session not persisting**
   - Check cookie settings (httpOnly, secure, sameSite)
   - Verify cookies are being set in browser DevTools

## Security Best Practices

1. **Never expose `WORKPACE_SUPABASE_SERVICE_ROLE_KEY`** in client-side code
2. **Use environment variables** for all sensitive configuration
3. **Enable Row Level Security (RLS)** on Supabase tables
4. **Use HTTPS** in production (required for secure cookies)
5. **Validate user input** on both client and server side
6. **Rate limit** authentication endpoints to prevent abuse

## NextAuth Integration

This codebase includes NextAuth integration with Supabase:

### NextAuth Supabase Adapter

The NextAuth configuration includes a Supabase adapter that stores NextAuth sessions in your Supabase database in a `next_auth` schema. This is automatically configured if you have:

- `NEXT_PUBLIC_WORKPACE_SUPABASE_URL`
- `WORKPACE_SUPABASE_SERVICE_ROLE_KEY`

The adapter will create the necessary tables in your Supabase database automatically on first use.

### NextAuth Supabase Provider

A Supabase credentials provider has been added to NextAuth, allowing you to use Supabase Auth through NextAuth. This provider supports:

- Email/password authentication
- Phone/OTP authentication

To use it, you can call NextAuth's `signIn` function with the `'supabase'` provider:

```typescript
import { signIn } from 'next-auth/react'

// Sign in with email/password
await signIn('supabase', {
  email: 'user@example.com',
  password: 'password123',
  redirect: false,
})

// Sign in with phone/OTP
await signIn('supabase', {
  phone: '+1234567890',
  otp: '123456',
  redirect: false,
})
```

**Note**: The Supabase adapter is a community-maintained integration. For official Supabase Auth support with additional features like built-in email server, phone auth, and MFA, consider using Supabase Auth Helpers for Next.js directly.

## Next Steps

1. Configure your Supabase project with the settings above
2. Add environment variables to your `.env.local` file
3. Test authentication endpoints using the API examples
4. Update your frontend components to use Supabase auth
5. Gradually migrate users from Auth0 to Supabase
6. (Optional) Set up the NextAuth Supabase adapter by ensuring your database connection string is configured

