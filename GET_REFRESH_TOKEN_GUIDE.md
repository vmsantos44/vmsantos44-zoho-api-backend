# Complete Guide: Get Zoho Refresh Token with Full Access

## Step 1: Create Server-based Application in Zoho

Go to: https://api-console.zoho.com/

**Fill in the form:**

- **Client Type:** Server-based Applications
- **Client Name:** `Alfa Systems GPT Backend` (or any name WITHOUT "Zoho" in it)
- **Homepage URL:** `https://vmsantos44-zoho-api-backend.vercel.app`
- **Authorized Redirect URIs:** `https://oauth.pstmn.io/v1/callback`

Click **CREATE**

## Step 2: Copy Your Credentials

After creating, you'll see:
- **Client ID:** (copy this)
- **Client Secret:** (copy this)

Keep these safe - you'll need them!

## Step 3: Generate Authorization URL

Replace `YOUR_CLIENT_ID` below with your actual Client ID:

```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoBooks.fullaccess.all,ZohoDrive.files.ALL,ZohoMail.messages.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=https://oauth.pstmn.io/v1/callback
```

**What these scopes give you:**
- `ZohoCRM.modules.ALL` - Full access to ALL CRM modules (Contacts, Leads, Deals, etc.)
- `ZohoCRM.settings.ALL` - Access to CRM settings
- `ZohoCRM.users.ALL` - Access to user information
- `ZohoBooks.fullaccess.all` - Full access to Zoho Books
- `ZohoDrive.files.ALL` - Access to Zoho Drive files
- `ZohoMail.messages.ALL` - Access to Zoho Mail

## Step 4: Visit the Authorization URL

1. Paste the URL (with your Client ID) into your browser
2. Log in to Zoho if prompted
3. Click **Accept** to grant permissions
4. You'll be redirected to: `https://oauth.pstmn.io/v1/callback?code=LONG_CODE_HERE`
5. **Copy the entire code** from the URL (everything after `code=` and before `&location=`)

## Step 5: Exchange Code for Refresh Token

Replace these values in the command below:
- `YOUR_CODE` - The code from Step 4
- `YOUR_CLIENT_ID` - Your Client ID from Step 2
- `YOUR_CLIENT_SECRET` - Your Client Secret from Step 2

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "code=YOUR_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=https://oauth.pstmn.io/v1/callback" \
  -d "grant_type=authorization_code"
```

**Response will look like:**
```json
{
  "access_token": "1000.abc123...",
  "refresh_token": "1000.def456...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Copy the `refresh_token` value** - this is what you need!

## Step 6: Update Vercel Environment Variables

Go to: https://vercel.com/vsantos-alfasystemscs-projects/vmsantos44-zoho-api-backend/settings/environment-variables

**Update or add these variables:**
- `ZOHO_CLIENT_ID` = Your Client ID from Step 2
- `ZOHO_CLIENT_SECRET` = Your Client Secret from Step 2
- `ZOHO_REFRESH_TOKEN` = The refresh_token from Step 5
- `ZOHO_API_DOMAIN` = `https://www.zohoapis.com`

## Step 7: Redeploy Vercel

After updating environment variables, Vercel will automatically redeploy.

Wait 1-2 minutes, then test:
```
https://vmsantos44-zoho-api-backend.vercel.app/api/search-lead?searchTerm=Santos
```

## Done!

Your API now has full access to:
- ✅ All CRM Modules (Contacts, Leads, Deals, etc.)
- ✅ Zoho Books
- ✅ Zoho Drive
- ✅ Zoho Mail

Your Custom GPT can now call any of these endpoints successfully!

---

## Quick Reference

**Your Vercel API:**
- Base URL: `https://vmsantos44-zoho-api-backend.vercel.app`
- Endpoints: `/api/search-contact`, `/api/search-lead`, `/api/get-notes`, `/api/send-email`

**Scopes requested:**
```
ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoBooks.fullaccess.all,ZohoDrive.files.ALL,ZohoMail.messages.ALL
```
