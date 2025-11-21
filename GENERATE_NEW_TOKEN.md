# Generate New Refresh Token - Quick Guide

## ⚠️ Why You Need This

The error you're seeing:
```
Error 2831: missing required parameter (method)
```

This is **Zoho Sheet API rejecting your request** because your current refresh token doesn't have the `ZohoSheet.dataAPI.READ` scope.

---

## 🚀 Quick 3-Step Fix

### **Step 1: Click This Link**

**Authorization URL (click to open):**
```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoBooks.fullaccess.all,ZohoWorkDrive.files.ALL,ZohoMail.messages.ALL,ZohoSheet.dataAPI.READ&client_id=1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL&response_type=code&access_type=offline&redirect_uri=https://oauth.pstmn.io/v1/callback
```

**What to do:**
1. Click the link above
2. Log in to Zoho (if needed)
3. Click **Accept** to grant permissions
4. You'll be redirected to a page that looks like:
   ```
   https://oauth.pstmn.io/v1/callback?code=1000.abc123def456...&location=us&accounts-server=https://accounts.zoho.com
   ```

5. **Copy ONLY the code** (everything between `code=` and `&location`)
   - Example: If URL is `...?code=1000.abc123&location...`
   - Copy: `1000.abc123`

---

### **Step 2: Exchange Code for Token**

Open Terminal and run this command (replace `PASTE_YOUR_CODE_HERE` with the code from Step 1):

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "code=PASTE_YOUR_CODE_HERE" \
  -d "client_id=1000.U6BSPSC0V6PL9B334JHWYQUOSBZECL" \
  -d "client_secret=76e882d0ce40ea4f2e3a23f03f14384ea14aa36f0c" \
  -d "redirect_uri=https://oauth.pstmn.io/v1/callback" \
  -d "grant_type=authorization_code"
```

**Expected Response:**
```json
{
  "access_token": "1000.xyz...",
  "refresh_token": "1000.abc...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Copy the `refresh_token` value** (starts with `1000.`)

---

### **Step 3: Update Vercel**

1. **Go to Vercel settings:**
   https://vercel.com/vsantos-alfasystemscs-projects/vmsantos44-zoho-api-backend/settings/environment-variables

2. **Find `ZOHO_REFRESH_TOKEN`**

3. **Click the 3 dots** → Edit

4. **Paste your new refresh token** (from Step 2)

5. **Click Save**

6. **Wait 1-2 minutes** for Vercel to redeploy

---

## ✅ Test It Works

After 2 minutes, ask Sara:

```
Get cell N6 from sheet tdar2201260c19806490a9eac0aa6e771d83e
```

**Expected:** Sara returns the value from your Sheet! 🎉

---

## 🚨 Troubleshooting

### "Invalid Code" Error
- The code expires in 60 seconds. Go back to Step 1 and get a fresh code.

### "Invalid Client" Error
- Double-check you copied the entire code (starts with `1000.`)

### Still Getting Error 2831
- Wait the full 2 minutes for Vercel to redeploy
- Clear your browser cache and try Sara again

---

## 📋 What This Token Gives You

Your new refresh token will have these scopes:
- ✅ ZohoCRM.modules.ALL (Contacts, Leads, Deals, Accounts)
- ✅ ZohoCRM.settings.ALL
- ✅ ZohoCRM.users.ALL
- ✅ ZohoBooks.fullaccess.all
- ✅ ZohoWorkDrive.files.ALL
- ✅ ZohoMail.messages.ALL
- ✅ **ZohoSheet.dataAPI.READ** ← NEW!

This is a **permanent token** (doesn't expire) that can access all these services.

---

**Ready? Start with Step 1!** 🚀
