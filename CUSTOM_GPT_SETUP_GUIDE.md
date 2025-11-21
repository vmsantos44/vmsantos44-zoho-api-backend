# Complete Custom GPT Setup Guide

## Step 1: Create Your Custom GPT

1. Go to ChatGPT: https://chat.openai.com/
2. Click on your profile → "My GPTs"
3. Click "Create a GPT"
4. Click "Configure" (skip the Create tab)

## Step 2: Basic Configuration

### Name
```
Alfa Systems CRM Assistant
```

### Description
```
Intelligent Zoho CRM assistant for Alfa Systems. Searches contacts/leads, retrieves notes, and drafts personalized emails automatically.
```

### Instructions
Copy and paste the entire contents from `CUSTOM_GPT_INSTRUCTIONS.md` into the instructions box.

**Quick copy command:**
```bash
# The instructions are in the file you just created
# Copy the full content of CUSTOM_GPT_INSTRUCTIONS.md
```

### Conversation Starters (Examples)
Add these as suggested prompts:
```
1. "Search for [candidate name]"
2. "Draft a follow-up email for [name]"
3. "Show me all Tier 1 candidates from Miami"
4. "What's the status of [candidate name]?"
```

### Knowledge Files
Upload the knowledge base file:
1. Click "Upload files" under Knowledge
2. Select `CRM_KNOWLEDGE_BASE.md`
3. This gives your GPT deep knowledge about your company, processes, tier system, and email templates

## Step 3: Configure Actions (API Integration)

1. Scroll down to "Actions"
2. Click "Create new action"
3. Click "Import from URL"
4. Enter this URL:
   ```
   https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema
   ```
5. Click "Import"

You should see these actions automatically configured:
- ✅ searchContact / searchLead
- ✅ getRecord
- ✅ getCommunications
- ✅ getNotes
- ✅ listAttachments
- ✅ getSheetData
- ✅ workdriveSearch / workdriveListFiles / workdriveGetFile
- ✅ sendEmail

### Authentication Setup

**Important:** The API uses environment variables on Vercel, so no authentication is needed in the GPT Actions. The endpoints are already secured.

1. Under "Authentication" → Select **"None"**
2. The Vercel backend handles Zoho OAuth automatically

## Step 4: Capabilities

Enable these capabilities:
- ✅ **Web Browsing** - OFF (not needed)
- ✅ **DALL-E Image Generation** - OFF (not needed)
- ✅ **Code Interpreter** - OFF (not needed)

Keep it simple - just the API actions.

## Step 5: Save and Test

1. Click "Save" in the top right
2. Choose visibility:
   - **Only me** - For testing
   - **Anyone with a link** - Share with team
   - **Public** - Make it public (not recommended for company CRM)

### Recommended: "Anyone with a link"
This lets you share with your team without making it public.

## Step 6: Test Your GPT

Try these test queries:

### Test 1: Search for a Contact
```
Search for William Santos
```

**Expected behavior:**
- GPT automatically calls `searchContact`
- Shows you the results with status, tier, email
- Offers to get notes or draft email

### Test 2: Draft an Email
```
Draft a follow-up email for [someone in your CRM]
```

**Expected behavior:**
- GPT searches for the person automatically
- Retrieves their notes
- Shows you what it found (status, tier, context)
- Drafts a personalized email
- Asks for approval before sending

### Test 3: Get Notes
```
What are the latest notes for [candidate name]?
```

**Expected behavior:**
- Searches for the person
- Gets their record ID
- Retrieves all notes
- Summarizes key points

## Troubleshooting

### "I can't find that action"
- Make sure you imported the schema URL correctly
- Check that Vercel deployed successfully
- Verify the URL: https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema

### "Authentication failed"
- The API uses server-side authentication (Vercel environment variables)
- Make sure your Vercel environment variables are set:
  - ZOHO_CLIENT_ID
  - ZOHO_CLIENT_SECRET
  - ZOHO_REFRESH_TOKEN
  - ZOHO_API_DOMAIN

### "Person not found"
- Try different search terms (email, full name, first name)
- Check if they're in Contacts vs Leads (GPT will try both)
- Verify the person exists in Zoho CRM

### GPT isn't being proactive
- Review the instructions - make sure you pasted the full CUSTOM_GPT_INSTRUCTIONS.md
- The instructions tell it to search automatically before asking for more info
- Give it specific examples in your prompts

## Advanced Configuration

### Add More Conversation Starters
Good examples:
```
- "Show me all candidates who need document follow-up"
- "Draft a welcome email for a new Tier 1 candidate"
- "Check the status of yesterday's applicants"
- "Find Spanish-speaking candidates in Miami"
```

### Customize Instructions
You can edit `CUSTOM_GPT_INSTRUCTIONS.md` to:
- Add your specific recruiters and territories
- Include company-specific email templates
- Define your custom workflows
- Add FAQ responses

Then update your GPT:
1. Open your Custom GPT
2. Click "Edit GPT"
3. Click "Configure"
4. Update the Instructions field
5. Save

### Update Knowledge Base
As your processes evolve:
1. Edit `CRM_KNOWLEDGE_BASE.md`
2. Re-upload to your GPT (replaces old version)
3. Your GPT now has updated information

## Sharing with Your Team

### Option 1: Link Sharing (Recommended)
1. Click "Share" in your GPT
2. Copy the link
3. Send to team members
4. They can use it immediately (must have ChatGPT Plus)

### Option 2: Workspace GPT
If you have ChatGPT Team or Enterprise:
1. Create the GPT in your workspace
2. Set visibility to "Workspace"
3. All team members can access

## Maintenance

### Updating the API
When you update the backend (add endpoints, change behavior):
1. Push changes to GitHub
2. Vercel auto-deploys
3. GPT automatically uses new version (no GPT update needed)

### Monitoring Usage
Check Vercel logs for:
- API usage patterns
- Error rates
- Response times
- Most-used endpoints

### Improving Over Time
As you use the GPT:
- Note common questions
- Add them to conversation starters
- Refine instructions based on behavior
- Update knowledge base with new processes

## Security Best Practices

1. **Never share credentials** - Keep Vercel environment variables private
2. **Use "Anyone with link"** - Don't make it public
3. **Limit team access** - Only share with authorized users
4. **Monitor API logs** - Watch for unusual activity
5. **Rotate tokens regularly** - Update Zoho refresh token periodically

## Support and Updates

### Getting Help
- Check Vercel deployment logs for API errors
- Review Custom GPT action logs for integration issues
- Test individual API endpoints directly: https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app

### Updating This Guide
As you discover better practices:
1. Update this file
2. Commit to GitHub
3. Share with team

---

## Quick Summary

**To set up your Custom GPT:**
1. Create new GPT in ChatGPT
2. Paste instructions from `CUSTOM_GPT_INSTRUCTIONS.md`
3. Upload `CRM_KNOWLEDGE_BASE.md` as knowledge
4. Import actions from `https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/schema`
5. Set authentication to "None"
6. Save and test

**You're done! 🎉**

Your team now has an intelligent CRM assistant that:
- Searches automatically
- Retrieves context from notes
- Drafts personalized emails
- Uses your company knowledge and templates

---

**Created:** November 2025
**Last Updated:** November 2025
**API Status:** https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app
