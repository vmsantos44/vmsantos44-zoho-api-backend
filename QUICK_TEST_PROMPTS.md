# Quick Test Prompts for Zoho Sheet Integration

## 🎯 Copy-Paste These into Sara's GPT

### Test 1: Simple Cell Value (Your Exact Sheet)
```
Get the value from cell N6 in this sheet:
https://sheet.zoho.com/sheet/open/tdar2201260c19806490a9eac0aa6e771d83e?sheetid=1&range=N6
```

**What Sara should do:**
1. Extract resource ID: `tdar2201260c19806490a9eac0aa6e771d83e`
2. Call `getSheetData(resourceId: "tdar2201260c19806490a9eac0aa6e771d83e", range: "N6")`
3. Show you the value

---

### Test 2: Just the Resource ID
```
Get cell N6 from sheet tdar2201260c19806490a9eac0aa6e771d83e
```

**What Sara should do:**
1. Call `getSheetData(resourceId: "tdar2201260c19806490a9eac0aa6e771d83e", range: "N6")`
2. Return the value

---

### Test 3: Range of Cells
```
Show me cells A1 to D5 from sheet tdar2201260c19806490a9eac0aa6e771d83e
```

**What Sara should do:**
1. Call `getSheetData(resourceId: "tdar2201260c19806490a9eac0aa6e771d83e", range: "A1:D5")`
2. Format and display the range

---

### Test 4: Verify Endpoint Exists
```
Do you have access to Zoho Sheet data? What Sheet-related endpoints do you have?
```

**What Sara should say:**
- "Yes, I have the getSheetData endpoint"
- Should mention it can read from CRM reporting sheets
- May list the endpoint parameters

---

## 🔍 Manual Testing (Before Sara)

Test if the code is deployed:

```bash
# Test 1: Check API version
curl https://vmsantos44-zoho-api-backend.vercel.app/api/schema | grep '"version"'
# Expected: "version":"2.1.0"

# Test 2: Check endpoint exists
curl https://vmsantos44-zoho-api-backend.vercel.app/api/schema | grep "get-sheet-data"
# Expected: Should see the endpoint definition

# Test 3: Try calling it (will fail until token updated)
curl "https://vmsantos44-zoho-api-backend.vercel.app/api/get-sheet-data?resourceId=tdar2201260c19806490a9eac0aa6e771d83e&range=N6"
# Expected: Error about missing scope (until you update token)
```

---

## ✅ Success Indicators

**Sara's response should include:**
- ✅ Mentions calling `getSheetData`
- ✅ Shows the resource ID used
- ✅ Shows the range requested
- ✅ Returns actual data from your sheet

**Sara's response should NOT:**
- ❌ Say "I don't have access to sheets"
- ❌ Say "endpoint not found"
- ❌ Try to use CRM API instead

---

## 🚨 If It Doesn't Work

### Error: "I don't have access to that endpoint"
**Fix:** Schema not updated. Wait 1-2 min for Vercel to redeploy, then try again.

### Error: "Access denied" or "403 Forbidden"
**Fix:** Refresh token doesn't have Sheet scope yet. Follow ZOHO_SHEET_INTEGRATION.md Step 1-2.

### Error: "Sheet not found"
**Fix:** Check resource ID is correct or you have access to the sheet in Zoho.

---

## 📊 What Your Sheet URL Looks Like

**Full URL:**
```
https://sheet.zoho.com/sheet/open/tdar2201260c19806490a9eac0aa6e771d83e?sheetid=1&range=N6
```

**Parts Sara needs:**
- **Resource ID:** `tdar2201260c19806490a9eac0aa6e771d83e` ✅ (always use this)
- **Range:** `N6` (or `A1:D10`, etc.)

Sara will automatically extract these from the URL or you can provide them directly.
