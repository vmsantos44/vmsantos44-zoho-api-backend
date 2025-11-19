# Generate Zoho OAuth Token with Full Access

## Current Problem
Your refresh token has limited scopes - it can access Contacts and Notes, but not Leads or other modules.

## Solution: Generate New Token with Full Scopes

### Step 1: Build Authorization URL

Replace these values:
- `YOUR_CLIENT_ID` = 1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL
- `YOUR_REDIRECT_URI` = Your registered redirect URI (check Zoho API Console)

**Full Access URL:**
```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoBooks.fullaccess.all&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=YOUR_REDIRECT_URI
```

**CRM-Only Full Access URL:**
```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=YOUR_REDIRECT_URI
```

### Step 2: Visit the URL in Browser

1. Paste the URL in your browser
2. Log in to Zoho
3. Click "Accept" to grant permissions
4. You'll be redirected to your redirect URI with a `code` parameter
5. Copy the code from the URL

### Step 3: Exchange Code for Refresh Token

Run this command (replace CODE, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI):

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "code=YOUR_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI" \
  -d "grant_type=authorization_code"
```

### Step 4: Update Vercel Environment Variables

Take the `refresh_token` from the response and update it in:
- Vercel: https://vercel.com/vsantos-alfasystemscs-projects/vmsantos44-zoho-api-backend/settings/environment-variables
- Update `ZOHO_REFRESH_TOKEN` with the new value

### Step 5: Redeploy

Vercel will automatically redeploy when you update environment variables.

## Scopes Explained

| Scope | What It Does |
|-------|-------------|
| `ZohoCRM.modules.ALL` | Access ALL CRM modules (Contacts, Leads, Deals, etc.) |
| `ZohoCRM.settings.ALL` | Access CRM settings |
| `ZohoCRM.users.ALL` | Access user information |
| `ZohoBooks.fullaccess.all` | Full access to Zoho Books |
| `ZohoDrive.files.ALL` | Access to Zoho Drive files |
| `ZohoMail.messages.ALL` | Access to Zoho Mail |

## Why This Happens

Each Zoho refresh token is "locked" to the scopes you requested when you first created it.

You **cannot** add new scopes to an existing token - you must generate a **new** refresh token with the broader scopes you need.

## Current Scopes vs Needed Scopes

**Your Current Token (limited):**
- ✅ Contacts.READ
- ✅ Notes.READ
- ❌ Leads.READ (missing)
- ❌ Books access (missing)
- ❌ Drive access (missing)

**What You Need (full access):**
- ✅ ZohoCRM.modules.ALL (includes Contacts, Leads, everything)
- ✅ ZohoBooks.fullaccess.all
- ✅ Any other Zoho services you use
