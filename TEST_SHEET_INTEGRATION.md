# Testing Zoho Sheet Integration

## Quick Verification Checklist

### ✅ Code Verification (Already Done)
- [x] OAuth scope added to GET_REFRESH_TOKEN_GUIDE.md
- [x] New endpoint created: pages/api/get-sheet-data.js
- [x] OpenAPI schema updated with Sheet endpoint
- [x] Sara's GPT instructions updated (8,000 chars exactly)
- [x] Syntax verified (ES module format for Next.js/Vercel)

---

## Test Prompts for Sara's GPT

Once you've deployed the new refresh token and code, test with these prompts:

### Test 1: Basic Sheet Access (Your Exact Sheet)
```
Get the value from cell N6 in the recruitment tracker sheet.
Resource ID: tdar2201260c19806490a9eac0aa6e771d83e
```

**Expected Result:**
- Sara calls `getSheetData(resourceId: "tdar2201260c19806490a9eac0aa6e771d83e", range: "N6")`
- Returns the value from that cell
- Displays it to you

### Test 2: Get a Range of Cells
```
Show me the data from cells A1 to D5 in the CRM dashboard.
Resource ID: tdar2201260c19806490a9eac0aa6e771d83e
```

**Expected Result:**
- Sara calls `getSheetData(resourceId: "tdar2201260c19806490a9eac0aa6e771d83e", range: "A1:D5")`
- Returns the range data
- Formats it nicely for you

### Test 3: Let Sara Figure Out Resource ID
```
I have a recruitment metrics sheet. Can you get the current candidate count from it?
(Then provide the sheet URL when Sara asks)
```

**Expected Result:**
- Sara asks for the sheet URL or resource ID
- You provide: `https://sheet.zoho.com/sheet/open/tdar2201260c19806490a9eac0aa6e771d83e?sheetid=1&range=N6`
- Sara extracts the resource ID and calls the API

### Test 4: Complex Query
```
Check the CRM dashboard sheet and tell me:
- Current total candidates (cell N6)
- Tier 1 count (wherever that is)
- Weekly new candidates (if available)
```

**Expected Result:**
- Sara makes multiple `getSheetData` calls if needed
- Aggregates the information
- Presents it clearly

---

## Testing Without Full Deployment

If you want to test the endpoint **before** generating the new refresh token:

### Option 1: Test Schema Update
```bash
curl https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema | grep -A10 "get-sheet-data"
```

**Expected:** You should see the new endpoint definition in the JSON response.

### Option 2: Test Endpoint (Will Fail on Auth, But Tests Structure)
```bash
curl "https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6"
```

**Expected:**
- If deployed but token not updated: "Access denied. Verify you have ZohoSheet.dataAPI.READ scope"
- If not deployed yet: 404 error
- Both are fine - just testing structure

---

## Manual API Test (After Token Update)

### Using curl:
```bash
curl "https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6"
```

**Expected Success Response:**
```json
{
  "success": true,
  "data": {
    // Zoho Sheet API response
  },
  "resourceId": "tdar2201260c19806490a9eac0aa6e771d83e",
  "range": "N6"
}
```

### Using Browser:
Open this URL:
```
https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6
```

---

## Deployment Status Check

### Step 1: Verify Code is Deployed
```bash
curl https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema | jq '.info.version'
```

**Expected:** `"2.1.0"` (updated version)

### Step 2: Verify Endpoint Exists
```bash
curl https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema | jq '.paths | keys'
```

**Expected:** Should include `"/api/get-sheet-data"` in the list

### Step 3: Test Sheet Endpoint
```bash
curl -i "https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6"
```

**Before token update:**
- Status: 403 or 500
- Error: "Access denied" or "Verify you have ZohoSheet.dataAPI.READ scope"

**After token update:**
- Status: 200
- JSON response with sheet data

---

## Common Issues

### Issue: "Access denied. Verify you have ZohoSheet.dataAPI.READ scope"
**Fix:** You need to generate a new refresh token with the Sheet scope (see ZOHO_SHEET_INTEGRATION.md)

### Issue: "Sheet not found"
**Fix:**
- Check the resource ID is correct
- Verify you can access the sheet manually in Zoho Sheet interface
- Make sure you're logged into the same Zoho account

### Issue: Endpoint returns 404
**Fix:**
- Wait 1-2 minutes for Vercel to deploy
- Check deployment status at: https://vercel.com/vsantos-alfasystemscs-projects/vmsantos44-zoho-api-backend/deployments
- Verify code was pushed to Git

---

## Quick Test Script

Save this as `test_sheet_endpoint.sh`:

```bash
#!/bin/bash

echo "Testing Zoho Sheet Integration..."
echo ""

# Test 1: Schema version
echo "1. Checking API version..."
VERSION=$(curl -s https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
echo "   Version: $VERSION"
if [ "$VERSION" = "2.1.0" ]; then
  echo "   ✅ Schema updated"
else
  echo "   ❌ Schema not updated (expected 2.1.0, got $VERSION)"
fi
echo ""

# Test 2: Endpoint exists
echo "2. Checking if Sheet endpoint exists in schema..."
if curl -s https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema | grep -q "get-sheet-data"; then
  echo "   ✅ Sheet endpoint found in schema"
else
  echo "   ❌ Sheet endpoint NOT in schema"
fi
echo ""

# Test 3: Endpoint responds
echo "3. Testing Sheet endpoint response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6")
echo "   HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ Endpoint working (token has Sheet scope)"
elif [ "$HTTP_CODE" = "403" ] || [ "$HTTP_CODE" = "500" ]; then
  echo "   ⚠️  Endpoint exists but needs token update"
elif [ "$HTTP_CODE" = "404" ]; then
  echo "   ❌ Endpoint not deployed yet"
fi
echo ""

echo "Test complete!"
```

Run with:
```bash
chmod +x test_sheet_endpoint.sh
./test_sheet_endpoint.sh
```

---

## Ready to Test?

**If you haven't deployed yet:**
1. Follow ZOHO_SHEET_INTEGRATION.md to deploy
2. Come back here and run the test prompts

**If you've already deployed:**
1. Try the test prompts above with Sara's GPT
2. Report any issues you encounter

**Quick Deploy Reminder:**
```bash
cd /Users/santos/Downloads/zoho-crm-gpt
git add .
git commit -m "Add Zoho Sheet integration"
git push
```

Then update the refresh token in Vercel settings.
