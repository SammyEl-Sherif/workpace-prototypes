# Vercel Custom Subdomain Configuration Checklist

## For: `dev.workpace.io` (or your custom subdomain)

### ✅ 1. Vercel Project Settings

#### Domain Configuration
- [x] **Add Custom Domain in Vercel**
  - Go to: Vercel Dashboard → Your Project → Settings → Domains
  - Add domain: `dev.workpace.io`
  - Verify DNS configuration (Vercel will show you what DNS records to add)
  - Wait for DNS propagation (can take a few minutes to 24 hours)

#### DNS Records (at your DNS provider)
- [x] **Add CNAME Record**
  - Type: `CNAME`
  - Name: `dev` (or your subdomain)
  - Value: `cname.vercel-dns.com` (or what Vercel tells you)
  - TTL: Auto or 3600

#### ⚠️ CRITICAL: Disable Vercel Protection Features
- [ ] **Disable Password Protection**
  - Go to: Vercel Dashboard → Your Project → Settings → Deployment Protection
  - **Disable "Password Protection"** if enabled
  - This is causing redirects to `vercel.com/login` instead of your app
  
- [ ] **Disable Deployment Protection (if not needed)**
  - Go to: Vercel Dashboard → Your Project → Settings → Deployment Protection
  - Check if "Deployment Protection" is enabled
  - If you're using your own Auth0 authentication, you likely don't need Vercel's protection
  - **Disable it** to allow public access to your custom domain

- [ ] **Check Team/Organization Settings**
  - Go to: Vercel Dashboard → Your Team/Organization → Settings
  - Check if there are any organization-wide protection settings
  - These might override project-level settings

### ✅ 2. Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

- [x] **NEXTAUTH_URL** (CRITICAL)
  - Value: `https://dev.workpace.io`
  - Environment: Production (and Preview if needed)
  - ⚠️ **MUST be set** - this is the root cause of your redirect issues

- [x] **NEXTAUTH_SECRET**
  - Value: A random secret (generate with: `openssl rand -base64 32`)
  - Environment: Production (and Preview if needed)
  - ⚠️ **MUST be set** - required for NextAuth

- [x] **AUTH0_CLIENT_ID**
  - Value: Your Auth0 Client ID
  - Environment: Production (and Preview if needed)

- [x] **AUTH0_CLIENT_SECRET**
  - Value: Your Auth0 Client Secret
  - Environment: Production (and Preview if needed)

- [x] **AUTH0_ISSUER_BASE_URL**
  - Value: Your Auth0 domain (e.g., `https://your-tenant.auth0.com`)
  - Environment: Production (and Preview if needed)

- [x] **AUTH0_SCOPE**
  - Value: Your Auth0 scope (e.g., `openid profile email`)
  - Environment: Production (and Preview if needed)

- [x] **AUTH0_AUDIENCE**
  - Value: Your Auth0 API audience
  - Environment: Production (and Preview if needed)

- [x] **NODE_ENV**
  - Value: `production`
  - Environment: Production

### ✅ 3. Auth0 Application Configuration

Go to: **Auth0 Dashboard → Applications → Your Application**

- [x] **Allowed Callback URLs**
  Add these URLs (comma-separated):
  ```
  https://dev.workpace.io/api/auth/callback/auth0
  https://dev.workpace.io/api/auth/callback/auth0
  ```
  ⚠️ **Note:** Include both with and without trailing slash if needed

- [x] **Allowed Logout URLs**
  Add these URLs (comma-separated):
  ```
  https://dev.workpace.io
  https://dev.workpace.io/*
  ```

- [ ] **Allowed Web Origins**
  Add:
  ```
  https://dev.workpace.io
  ```

- [ ] **Allowed Origins (CORS)**
  Add:
  ```
  https://dev.workpace.io
  ```

### ✅ 4. Code Configuration

- [x] **Fixed `src/api/routes/auth/auth.ts`**
  - ✅ Removed `/api/auth` from host header (host should only be domain)
  - ✅ Added proper NEXTAUTH_URL handling
  - ✅ Added fallback to use Vercel's `x-forwarded-host` header

- [x] **Updated `src/server/utils/getAuthOptions/getAuthOptions.ts`**
  - ✅ Added explicit `url` option when NEXTAUTH_URL is set

### ✅ 5. Verify Configuration

After setting everything up:

1. [ ] **Redeploy your Vercel application**
   - Push changes to trigger a new deployment, OR
   - Go to Vercel Dashboard → Deployments → Redeploy latest

2. [ ] **Clear browser cookies**
   - Clear all cookies for `dev.workpace.io`
   - Or use incognito/private browsing

3. [ ] **Test Authentication Flow**
   - [ ] Visit `https://dev.workpace.io`
   - [ ] Should redirect to sign-in page
   - [ ] Click sign-in → should redirect to Auth0
   - [ ] After Auth0 login → should redirect back to `https://dev.workpace.io`
   - [ ] Should NOT redirect to `/api/auth/error`

4. [ ] **Check Browser Network Tab**
   - Open DevTools → Network tab
   - Look for redirect URLs - they should all use `https://dev.workpace.io`
   - Should NOT see `workpace-prototypes-*.vercel.app` in redirect URLs

### ✅ 6. Troubleshooting

If you still see `/api/auth/error`:

1. [ ] **Verify NEXTAUTH_URL is set correctly**
   ```bash
   # Check in Vercel Dashboard → Environment Variables
   # Should be exactly: https://dev.workpace.io
   # NOT: https://dev.workpace.io/
   # NOT: http://dev.workpace.io
   ```

2. [ ] **Check Vercel Function Logs**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check logs for `/api/auth/[...nextauth]`
   - Look for any errors

3. [ ] **Verify Auth0 Callback URLs**
   - Make sure `https://dev.workpace.io/api/auth/callback/auth0` is in Auth0
   - Check for typos or missing `https://`

4. [ ] **Check DNS Propagation**
   ```bash
   # Verify DNS is pointing to Vercel
   dig dev.workpace.io CNAME
   # Should show cname.vercel-dns.com or similar
   ```

5. [ ] **Verify SSL Certificate**
   - Visit `https://dev.workpace.io` directly
   - Should show valid SSL certificate
   - Should NOT show security warnings

### ✅ 7. Common Issues

#### Issue: Redirecting to `vercel.com/login` (Vercel SSO/Protection)
- **Root Cause:** Vercel Password Protection or Deployment Protection is enabled
- **Solution:** 
  1. Go to Vercel Dashboard → Your Project → Settings → Deployment Protection
  2. **Disable "Password Protection"**
  3. **Disable "Deployment Protection"** (if you're using your own Auth0 auth)
  4. Check Team/Organization settings for organization-wide protection
  5. Redeploy your application
- **Reference:** [Vercel Deployment Protection Docs](https://vercel.com/docs/security/deployment-protection)

#### Issue: Still redirecting to `/api/auth/error`
- **Solution:** Make sure `NEXTAUTH_URL` is set in Vercel environment variables
- **Solution:** Redeploy after setting environment variables
- **Solution:** Clear browser cookies

#### Issue: 404 Page Not Found
- **Solution:** Verify domain is properly configured in Vercel
- **Solution:** Check DNS records are correct
- **Solution:** Wait for DNS propagation (can take up to 24 hours)

#### Issue: Auth0 callback fails
- **Solution:** Verify callback URL in Auth0 matches exactly: `https://dev.workpace.io/api/auth/callback/auth0`
- **Solution:** Check for typos in domain name
- **Solution:** Ensure `NEXTAUTH_URL` matches the domain in Auth0 callback URLs

#### Issue: Host header shows Vercel internal domain
- **Solution:** This is normal - Vercel sets `x-forwarded-host` header for custom domains
- **Solution:** The code now uses `NEXTAUTH_URL` first, then falls back to `x-forwarded-host`
- **Solution:** Make sure `NEXTAUTH_URL` is set so it doesn't need to fall back

### ✅ 8. Final Checklist Before Going Live

- [ ] All environment variables set in Vercel
- [ ] Domain added and verified in Vercel
- [ ] DNS records configured correctly
- [ ] Auth0 callback URLs updated
- [ ] Application redeployed
- [ ] Tested authentication flow end-to-end
- [ ] No errors in browser console
- [ ] No errors in Vercel function logs
- [ ] SSL certificate valid (green lock in browser)

---

## Quick Reference

**Your Custom Domain:** `dev.workpace.io`

**Critical Environment Variable:**
```
NEXTAUTH_URL=https://dev.workpace.io
```

**Auth0 Callback URL:**
```
https://dev.workpace.io/api/auth/callback/auth0
```

**Code Files Updated:**
- `src/api/routes/auth/auth.ts` - Fixed host header logic
- `src/server/utils/getAuthOptions/getAuthOptions.ts` - Added URL configuration

