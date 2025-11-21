# Zoho WorkDrive Integration

This document explains how the new WorkDrive actions work, how to configure credentials, and how Sara's GPT should use them.

---

## Overview

- ✅ Added dedicated WorkDrive API helper with automatic OAuth refresh
- ✅ New endpoints: `/api/workdrive-search`, `/api/workdrive-list-files`, `/api/workdrive-file`, `/api/workdrive-download`
- ✅ Download links automatically point to your public Vercel deployment so Sara can hand them to recruiters
- ✅ GPT instructions + schema updated so Sara knows when to look inside WorkDrive (MSAs, NDAs, onboarding docs, etc.)

---

## Required OAuth Scope

Generate a refresh token that **includes** the WorkDrive scope:

```
ZohoWorkDrive.files.ALL
```

If you're regenerating credentials, use the combined scope string that already includes CRM, Books, Sheet, etc. Example:

```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoBooks.fullaccess.all,ZohoWorkDrive.files.ALL,ZohoMail.messages.ALL,ZohoSheet.dataAPI.READ&client_id=1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL&response_type=code&access_type=offline&redirect_uri=https://oauth.pstmn.io/v1/callback
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ZOHO_WORKDRIVE_ORG_ID` | ✅ | Organization ID from WorkDrive (Settings → Admin Panel → Organization) |
| `ZOHO_WORKDRIVE_DEFAULT_PARENT_ID` | Optional | Folder ID to use when GPT does not provide `parentId` |
| `PUBLIC_API_BASE_URL` | Optional | Base URL used to build download links (defaults to production Vercel URL) |

> Reminder: `ZOHO_FROM_EMAIL` is also required for CRM emails and should already be present.

---

## Endpoints

### 1. `GET /api/workdrive-search`
- Parameters: `query` (required), `parentId`, `limit`, `offset`, `includeFolders`
- Returns normalized file metadata + GPT-ready download URLs
- Use case: "Find Staffworthy NDA", "Do we have William's contract?"

### 2. `GET /api/workdrive-list-files`
- Parameters: `parentId` (defaults to env), `limit`, `nextToken`
- Lists folder contents and supports pagination via `next_token`

### 3. `GET /api/workdrive-file`
- Parameters: `fileId` (required)
- Returns metadata for a single file. GPT can call this to refresh download links.

### 4. `GET /api/workdrive-download`
- Parameters: `fileId` (required), `inline` (`true`/`false`)
- Streams binary file through the API. GPT does **not** call this directly; instead it shares the generated URL so humans can click.

Each response includes fields like `name`, `path`, `size`, `mime_type`, `owner`, `modified_time`, and `download_url`.

---

## Testing Checklist

1. **Search**
   ```bash
   curl "https://YOUR_VERCEL_URL/api/workdrive-search?query=MSA"
   ```
2. **List Folder**
   ```bash
   curl "https://YOUR_VERCEL_URL/api/workdrive-list-files?parentId=ld0abcdefgh123"
   ```
3. **Get File Details**
   ```bash
   curl "https://YOUR_VERCEL_URL/api/workdrive-file?fileId=ld0abcdefgh123"
   ```
4. **Download**
   ```bash
   curl -o output.pdf "https://YOUR_VERCEL_URL/api/workdrive-download?fileId=ld0abcdefgh123"
   ```

Replace `YOUR_VERCEL_URL` with `https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app` (or your custom domain).

---

## GPT Behavior Update

The updated instructions tell Sara to:
- Use WorkDrive when users ask for contracts, NDAs, MSAs, onboarding packs, or any document not stored as CRM attachment.
- Provide a concise summary of the file (name, type, last modified, owner) and the download link from the API response.
- When multiple files match, list a short table with file name + description so the recruiter can pick.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `WorkDrive org id missing` error | Set `ZOHO_WORKDRIVE_ORG_ID` in Vercel |
| `NO_PERMISSION` or `Invalid OAUTH scope` | Regenerate refresh token with `ZohoWorkDrive.files.ALL` |
| Download link returning 500 | Confirm `PUBLIC_API_BASE_URL` matches deployed domain and that the file still exists |
| GPT can't see WorkDrive endpoints | Ensure schema version `2.2.0` is live and re-import in the GPT editor |

---

With these endpoints the recruitment GPT can finally retrieve NDAs, WorkDrive MSAs, onboarding packets, or any other document without leaving ChatGPT. Let Sara know she can now answer "Do we have their signed contract?" immediately.
