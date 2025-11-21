# Zoho Sheet Integration - Complete Implementation Guide

## Overview

This integration adds **read-only access** to your Zoho Sheet reporting dashboard from the Custom GPT. The Sheet is auto-populated hourly with CRM data, making it easier to answer complex filtering queries that are difficult via the CRM API alone.

**Use Case:** Your Zoho Sheet acts as a data warehouse layer on top of the CRM, allowing Sara's GPT to query pre-aggregated or filtered data instead of making hundreds of API calls to the CRM.

---

## What Was Implemented

### 1. OAuth Scope Added ✅
**File:** `GET_REFRESH_TOKEN_GUIDE.md`

Added `ZohoSheet.dataAPI.READ` scope for read-only access to Zoho Sheet data.

**New authorization URL:**
```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoBooks.fullaccess.all,ZohoWorkDrive.files.ALL,ZohoMail.messages.ALL,ZohoSheet.dataAPI.READ&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=https://oauth.pstmn.io/v1/callback
```

### 2. New API Endpoint ✅
**File:** `pages/api/get-sheet-data.js`

**Endpoint:** `/api/get-sheet-data`

**Parameters:**
- `resourceId` (required) - The Zoho Sheet ID from the URL
  - Example: `tdar2201260c19806490a9eac0aa6e771d83e`
- `range` (optional) - Cell range to retrieve
  - Examples: `N6` (single cell), `A1:D10` (range), `Sheet1!A1:B5` (specific sheet)

**Example Usage:**
```
GET /api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Zoho Sheet API response format
  },
  "resourceId": "tdar2201260c19806490a9eac0aa6e771d83e",
  "range": "N6"
}
```

### 3. OpenAPI Schema Updated ✅
**File:** `pages/api/schema.js`

- Added `/api/get-sheet-data` endpoint definition
- Updated API version to `2.1.0`
- Updated description to include "query reporting data from Zoho Sheet dashboard"

The Custom GPT will automatically discover this endpoint via the schema.

### 4. GPT Instructions Updated ✅
**File:** `CUSTOM_GPT_INSTRUCTIONS_SARA.md`

Added one line to the "What Each Endpoint Gives You" section:

```markdown
**getSheetData** → CRM reporting sheet (use for complex filtering hard to do via CRM API)
```

**Character count:** Exactly 8,000 / 8,000 (perfectly optimized!)

---

## How to Deploy

### Step 1: Generate New Refresh Token

You need a **new refresh token** with the additional Sheet scope.

1. **Go to Zoho API Console:**
   https://api-console.zoho.com/

2. **Find your application** (Client ID: `1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL`)

3. **Generate authorization URL:**
   Replace `YOUR_CLIENT_ID` with `1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL`:

   ```
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoBooks.fullaccess.all,ZohoWorkDrive.files.ALL,ZohoMail.messages.ALL,ZohoSheet.dataAPI.READ&client_id=1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL&response_type=code&access_type=offline&redirect_uri=https://oauth.pstmn.io/v1/callback
   ```

4. **Visit the URL** in your browser
   - Log in to Zoho
   - Click **Accept**
   - You'll be redirected to: `https://oauth.pstmn.io/v1/callback?code=LONG_CODE_HERE`
   - Copy the entire code from the URL

5. **Exchange code for refresh token:**
   ```bash
   curl -X POST https://accounts.zoho.com/oauth/v2/token \
     -d "code=PASTE_CODE_HERE" \
     -d "client_id=1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL" \
     -d "client_secret=76e882d0ce40ea4f2e3a23f03f14384ea14aa36f0c" \
     -d "redirect_uri=https://oauth.pstmn.io/v1/callback" \
     -d "grant_type=authorization_code"
   ```

6. **Copy the `refresh_token` value** from the response

### Step 2: Update Vercel Environment Variables

1. **Go to Vercel:**
   https://vercel.com/vsantos-alfasystemscs-projects/vmsantos44-zoho-api-backend/settings/environment-variables

2. **Update `ZOHO_REFRESH_TOKEN`** with your new refresh token from Step 1

3. **Vercel will auto-redeploy** (wait 1-2 minutes)

### Step 3: Deploy Code Changes

```bash
cd /Users/santos/Downloads/zoho-crm-gpt
git add .
git commit -m "Add Zoho Sheet integration for CRM reporting dashboard"
git push
```

Vercel will automatically deploy the new endpoint.

### Step 4: Update Sara's GPT

1. Go to: https://chatgpt.com/gpts/editor/[YOUR_GPT_ID]

2. **Update Instructions:**
   - Copy the entire contents of `CUSTOM_GPT_INSTRUCTIONS_SARA.md`
   - Paste into the "Instructions" field
   - Character count should be exactly 8,000 ✅

3. **Save changes**

The GPT will automatically reload the OpenAPI schema and discover the new `getSheetData` endpoint.

---

## How to Use

### Example 1: Get Single Cell Value

**User asks Sara's GPT:**
> "What's the current candidate count in cell N6?"

**GPT will call:**
```
GET /api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6
```

**GPT will respond:**
> "The current candidate count is 127 (from cell N6 in the CRM dashboard)."

### Example 2: Get Range of Data

**User asks:**
> "Show me the tier breakdown from cells A10 to A13"

**GPT will call:**
```
GET /api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=A10:A13
```

### Example 3: Complex Filtering Query

**User asks:**
> "How many Tier 1 Portuguese candidates are from Cape Verde and have been contacted in the last 7 days?"

**Instead of:**
- Fetching all candidates from CRM (hundreds of API calls)
- Filtering by tier, language, location, last contact date
- Counting manually

**GPT can:**
- Query your Zoho Sheet if you have this pre-calculated
- Return instant results

---

## Sheet URL Format

Your Zoho Sheet URL looks like this:
```
https://sheet.zoho.com/sheet/open/tdar2201260c19806490a9eac0aa6e771d83e?sheetid=1&range=N6
```

**Break it down:**
- **Resource ID:** `tdar2201260c19806490a9eac0aa6e771d83e`
- **Sheet ID:** `1` (first sheet in the workbook)
- **Range:** `N6` (the cell or range you want)

**To use in the API:**
```
resourceId=tdar2201260c19806490a9eac0aa6e771d83e
range=N6
```

---

## Architecture Benefits

### Before (CRM API Only):
```
User: "Find candidates with X criteria"
  ↓
GPT searches ALL candidates via CRM API
  ↓
Fetches details for EACH candidate (100s of API calls)
  ↓
Filters manually
  ↓
Returns result (slow, expensive)
```

### After (With Sheet Integration):
```
User: "Find candidates with X criteria"
  ↓
GPT queries pre-aggregated Sheet dashboard
  ↓
Returns result instantly (1 API call)
```

---

## Security Notes

- **Read-only access:** The scope is `ZohoSheet.dataAPI.READ` (cannot modify sheets)
- **No write access:** GPT cannot change data in the sheet
- **Server-side auth:** OAuth credentials stored in Vercel environment variables (not visible to GPT or users)
- **Same security model:** Uses the same refresh token mechanism as existing CRM endpoints

---

## Troubleshooting

### Error: "Access denied. Verify you have ZohoSheet.dataAPI.READ scope"

**Solution:** Your refresh token doesn't have the Sheet scope. Follow Step 1 to generate a new token.

### Error: "Sheet not found"

**Solution:**
- Check that the `resourceId` is correct
- Verify you have access to the sheet in Zoho Sheet interface

### GPT doesn't see the new endpoint

**Solution:**
- Wait 1-2 minutes for Vercel to redeploy
- Test the schema manually: https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema
- Look for `/api/get-sheet-data` in the JSON response

---

## Testing

### Test the endpoint directly:

```bash
curl "https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6"
```

**Expected response:**
```json
{
  "success": true,
  "data": { ... },
  "resourceId": "tdar2201260c19806490a9eac0aa6e771d83e",
  "range": "N6"
}
```

### Test via Sara's GPT:

Once deployed, ask Sara:
> "Get the value from cell N6 in the recruitment tracker sheet"

She should automatically call `getSheetData` with the correct parameters.

---

## Files Modified

1. **GET_REFRESH_TOKEN_GUIDE.md** - Added `ZohoSheet.dataAPI.READ` scope
2. **pages/api/get-sheet-data.js** - New API endpoint (created)
3. **pages/api/schema.js** - Added Sheet endpoint definition
4. **CUSTOM_GPT_INSTRUCTIONS_SARA.md** - Added `getSheetData` to endpoint list
5. **ZOHO_SHEET_INTEGRATION.md** - This documentation file (created)

---

## Next Steps

1. Follow deployment steps above
2. Test with a simple query: "Get value from cell N6"
3. Add more pre-calculated metrics to your Sheet
4. Sara will automatically use the Sheet for complex queries

**Ready to deploy!** 🚀
