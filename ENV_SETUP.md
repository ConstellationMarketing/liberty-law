# Environment Setup Guide

This document explains how to configure the required environment variables for the CMS to function correctly.

## Required Environment Variables

The application requires three Supabase environment variables to connect to the database:

| Variable                    | Description                   | Where to Use     |
| --------------------------- | ----------------------------- | ---------------- |
| `VITE_SUPABASE_URL`         | Your Supabase project URL     | Client & Server  |
| `VITE_SUPABASE_ANON_KEY`    | Public anonymous key (JWT)    | Client-side      |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role key (JWT) | Server-side only |

## Getting Your Supabase Credentials

1. **Log in to Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Find Your Project URL**
   - Navigate to: **Settings** → **API**
   - Copy the **Project URL**
   - Example: `https://yruteqltqizjvipueulo.supabase.co`

3. **Find Your API Keys**
   - On the same **Settings** → **API** page:
   - **anon public** key → Copy this for `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → Copy this for `SUPABASE_SERVICE_ROLE_KEY`

### Key Format Verification

Valid Supabase keys are **JWT tokens** and should:

- Start with `eyJ` (base64 encoded JSON)
- Be very long (hundreds of characters)
- Look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...`

**Warning**: If your keys start with `sb_publishable_` or `sb_secret_`, these are **NOT** Supabase keys. Double-check you're copying from the correct service.

## Configuration Methods

### Method 1: Using `.env.local` (Recommended for Development)

Create a `.env.local` file in the project root:

```bash
# Local environment variables - DO NOT COMMIT
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note**: `.env.local` is gitignored by default and will not be committed.

### Method 2: Using DevServerControl Tool

If you're working in the Builder.io environment, you can set environment variables using the DevServerControl tool:

```typescript
// Set each variable individually
DevServerControl.set_env_variable(["VITE_SUPABASE_URL", "https://..."]);
DevServerControl.set_env_variable(["VITE_SUPABASE_ANON_KEY", "eyJ..."]);
DevServerControl.set_env_variable(["SUPABASE_SERVICE_ROLE_KEY", "eyJ..."]);

// Restart the dev server
DevServerControl.restart = true;
```

### Method 3: Production Deployment

For production deployments (Netlify, Vercel, etc.):

1. Go to your hosting provider's dashboard
2. Navigate to environment variables settings
3. Add all three variables with their values
4. Redeploy your application

## Verifying Your Configuration

### 1. Check Health Endpoint

After setting environment variables and restarting, visit:

```
http://localhost:8080/api/health
```

This endpoint will report:

- ✅ Which environment variables are set
- ✅ Whether Supabase connection is working
- ❌ Any configuration issues

### 2. Check Browser Console

Open your browser's developer console and look for:

```
[SiteSettingsContext] Settings loaded successfully from database
```

### 3. Test Admin Access

Navigate to `/admin` - you should:

- ✅ See the login page (if not authenticated)
- ✅ Be able to log in
- ❌ NOT see a "Configuration Error" message

## Troubleshooting

### Issue: Header/Footer shows default content

**Cause**: Unable to connect to Supabase database

**Solution**:

1. Verify all three environment variables are set
2. Check the browser console for error messages
3. Visit `/api/health` to diagnose the issue
4. Ensure your Supabase keys are valid JWT tokens

### Issue: Admin redirects immediately or shows error

**Cause**: Missing or invalid `SUPABASE_SERVICE_ROLE_KEY`

**Solution**:

1. Verify you copied the **service_role** key (not the anon key)
2. Check the key format starts with `eyJ`
3. Restart the dev server after setting the variable

### Issue: "Network error - unable to connect"

**Cause**: Invalid `VITE_SUPABASE_URL`

**Solution**:

1. Verify the URL format: `https://[project-id].supabase.co`
2. Ensure there are no trailing slashes
3. Check your internet connection

### Issue: "Authentication failed - invalid credentials"

**Cause**: Expired or incorrect API keys

**Solution**:

1. Regenerate keys in Supabase dashboard (Settings → API)
2. Update your `.env.local` file with new keys
3. Restart the dev server

## Environment Variable Precedence

Variables are loaded in this order (later overrides earlier):

1. `.env` - Default/public variables (committed to git)
2. `.env.local` - Local overrides (gitignored, NOT committed)
3. System environment variables
4. DevServerControl runtime variables

**Best Practice**: Use `.env.local` for secrets and local development.

## Security Notes

⚠️ **NEVER commit `.env.local` to git**
⚠️ **NEVER expose `SUPABASE_SERVICE_ROLE_KEY` to the client**
⚠️ **Rotate keys immediately if accidentally exposed**

The service role key has full database access and should only be used server-side.

## Need Help?

- Check `/api/health` for diagnostics
- Review browser console for detailed error messages
- Verify your Supabase project is active and accessible
- Contact your team lead if issues persist
