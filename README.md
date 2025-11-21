# Zoho CRM API for GPT

This is a Next.js API that securely connects to Zoho CRM and can be used with Custom GPTs.

## Setup Instructions

### 1. Deploy to Vercel

You can deploy this directly to Vercel using the Vercel CLI or dashboard.

### 2. Set Environment Variables in Vercel

After deploying, go to your Vercel project settings and add these environment variables:

- `ZOHO_CLIENT_ID`: Your Zoho OAuth Client ID
- `ZOHO_CLIENT_SECRET`: Your Zoho OAuth Client Secret
- `ZOHO_REFRESH_TOKEN`: Your Zoho OAuth Refresh Token
- `ZOHO_FROM_EMAIL`: Default "from" address when GPT sends email via CRM
- `ZOHO_WORKDRIVE_ORG_ID`: WorkDrive organization ID (required for document endpoints)

Optional (if you're using a different Zoho datacenter):
- `ZOHO_API_DOMAIN`: Default is `https://www.zohoapis.com`
- `ZOHO_ACCOUNTS_DOMAIN`: Default is `https://accounts.zoho.com`
- `ZOHO_WORKDRIVE_DEFAULT_PARENT_ID`: Default folder to search/list if none is provided
- `PUBLIC_API_BASE_URL`: Base URL for download links (defaults to production deployment)

### 3. API Endpoints

#### Search Contacts
```
GET /api/search-contact?searchTerm=John
```

Searches for contacts by first name, last name, or email.

#### Search Leads
```
GET /api/search-lead?searchTerm=Acme
```

Searches for leads by first name, last name, email, or company name.

#### Get Notes
```
GET /api/get-notes?module=Contacts&recordId=123456789
```

Gets all notes for a specific record. Module can be: Contacts, Leads, Deals, etc.

#### Send Email
```
POST /api/send-email
Content-Type: application/json

{
  "toAddress": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content",
  "fromAddress": "sender@yourdomain.com" (optional)
}
```

Sends an email via Zoho CRM.

#### Search WorkDrive Documents
```
GET /api/workdrive-search?query=MSA&parentId=ld0abcdef12345
```

Searches Zoho WorkDrive for files/folders (optionally scoped to a specific folder). Returns normalized metadata plus ready-to-share download links.

#### List Files in a WorkDrive Folder
```
GET /api/workdrive-list-files?parentId=ld0abcdef12345
```

Lists the contents of a specific WorkDrive folder (defaults to `ZOHO_WORKDRIVE_DEFAULT_PARENT_ID` when provided).

#### Get WorkDrive File Details
```
GET /api/workdrive-file?fileId=ld0abcdef12345
```

Returns normalized metadata for a specific file along with a download URL the GPT can provide to users.

#### Download WorkDrive File (human use)
```
GET /api/workdrive-download?fileId=ld0abcdef12345
```

Streams the binary file directly from WorkDrive through this API so users can download attachments that Sara references.

### 4. Using with Custom GPT

1. Go to ChatGPT and create a new Custom GPT
2. In the Actions section, add your Vercel deployment URL
3. Import the OpenAPI schema (or manually configure the action)
4. Test by asking: "Find contact John Smith in Zoho"

## How to Get Zoho Credentials

If you don't have your credentials yet:

1. Go to https://api-console.zoho.com/
2. Create a new "Server-based Application"
3. Note your Client ID and Client Secret
4. Generate a refresh token using the OAuth flow

## Security Notes

- Never commit your `.env` file or credentials to Git
- All credentials are stored securely as environment variables in Vercel
- The API handles token refresh automatically
- Credentials are never exposed to the frontend

## Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in your credentials
3. Run `npm run dev`
4. Visit http://localhost:3000
