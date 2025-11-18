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

Optional (if you're using a different Zoho datacenter):
- `ZOHO_API_DOMAIN`: Default is `https://www.zohoapis.com`
- `ZOHO_ACCOUNTS_DOMAIN`: Default is `https://accounts.zoho.com`

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
