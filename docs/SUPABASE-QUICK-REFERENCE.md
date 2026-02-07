# Supabase Auth Quick Reference

## Configuration Checklist

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Add environment variables to `.env.local`:
  - `NEXT_PUBLIC_WORKPACE_SUPABASE_URL`
  - `WORKPACE_SUPABASE_SERVICE_ROLE_KEY`
  - `WORKPACE_SUPABASE_SERVICE_ROLE_KEY`
- [ ] Enable Phone and Email providers in Supabase dashboard
- [ ] Configure SMS provider (Twilio) for phone authentication
- [ ] Set Site URL in Supabase dashboard

## Environment Variables

Add these to your `.env.local` file:

```bash
# Get these from Supabase Dashboard > Settings > API

# ✅ Public (safe to expose to client)
NEXT_PUBLIC_WORKPACE_SUPABASE_URL=https://your-project-id.supabase.co
WORKPACE_SUPABASE_SERVICE_ROLE_KEY=your-publishable-key-or-anon-key-here
# Note: "Publishable key" (new) and "anon key" (legacy) are the same - both are safe to expose
# They're restricted by RLS policies and designed to be public

# ⚠️ Secret (server-only, no NEXT_PUBLIC_ prefix)
WORKPACE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## API Endpoints

| Endpoint                     | Method | Description                              |
| ---------------------------- | ------ | ---------------------------------------- |
| `/api/auth/supabase/signup`  | POST   | Sign up with email or phone              |
| `/api/auth/supabase/signin`  | POST   | Sign in with email/password or phone OTP |
| `/api/auth/supabase/verify`  | POST   | Verify OTP for phone/email               |
| `/api/auth/supabase/signout` | POST   | Sign out and clear session               |

## Code Examples

### Sign Up with Email

```typescript
const response = await fetch("/api/auth/supabase/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});
```

### Sign Up with Phone (Passwordless)

```typescript
const response = await fetch("/api/auth/supabase/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phone: "+1234567890",
  }),
});
```

### Sign In with Email/Password

```typescript
const response = await fetch("/api/auth/supabase/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});
```

### Sign In with Phone OTP

```typescript
// Step 1: Request OTP
await fetch("/api/auth/supabase/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phone: "+1234567890",
  }),
});

// Step 2: Verify OTP
await fetch("/api/auth/supabase/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phone: "+1234567890",
    token: "123456",
    type: "sms",
  }),
});
```

### Protected API Route

```typescript
import { withSupabaseAuth } from "@/server/utils";

export default withSupabaseAuth(async (req, res, session) => {
  // session.user contains authenticated user
  // session.accessToken contains access token
  res.json({ user: session.user });
});
```

### Client-Side Supabase Client

```typescript
import { getSupabaseClient } from "@/utils/supabase/client";

const supabase = getSupabaseClient();
const { data: { user } } = await supabase.auth.getUser();
```

## File Locations

- **Server utilities**: `src/server/utils/supabase/`
- **Auth wrappers**: `src/server/utils/withSupabaseAuth/`
- **API routes**: `src/apis/routes/auth/supabase/`
- **Next.js handlers**: `src/pages/api/auth/supabase/`
- **Client utilities**: `src/utils/supabase/client.ts`
- **Interfaces**: `src/interfaces/user.ts` (SupabaseSession)

## Important Notes

- Auth0 code is preserved and still functional
- Both authentication systems can coexist
- Supabase routes are public (no auth required to call them)
- Sessions are stored in HTTP-only cookies
- Service role key should NEVER be exposed to client
