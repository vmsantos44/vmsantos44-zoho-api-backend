# Custom GPT Setup Guide - Sara Gomes

## 📋 Quick Setup Checklist

### 1. **GPT Name**
```
Alfa Systems CRM - Sara Gomes
```

### 2. **GPT Description** (Use Option 1)
```
Intelligent CRM assistant for Alfa Systems recruitment team. Searches contacts/leads, drafts personalized emails with full context (history, notes, attachments), and provides candidate insights. Always gathers complete context before responding - reviews email history, call logs, and notes to prevent redundant questions. Handles privacy policy inquiries and follows strict security guardrails (never shares credentials, always shows email drafts before sending, requires approval for status changes).
```

**Character Count:** 458 characters

### 3. **Instructions**
Copy and paste the entire contents of:
```
CUSTOM_GPT_INSTRUCTIONS_SARA.md
```

**Character Count:** 7,951 / 8,000 ✅

### 4. **Conversation Starters** (Pick 4)

#### Recommended Set:
1. `"Find a candidate and show me their complete profile"`
2. `"Draft a follow-up email for a candidate about pending documents"`
3. `"List all candidates with sent emails but no replies in the last 3 days"`
4. `"What data does Alfa Systems collect from candidates?"`

#### Alternative Options:
- `"Draft an interview confirmation email in Portuguese"`
- `"Show me all candidates with overdue tasks or missing documents"`
- `"Create a welcome email for new Tier 1 candidates"`
- `"Find candidates with resumes but missing certifications"`

### 5. **Knowledge Files**
None required (API-based)

### 6. **Capabilities**
- ✅ **Web Browsing** - OFF
- ✅ **Image Generation** - OFF
- ✅ **Code Interpreter** - OFF

### 7. **Actions (API Integration)**

**Import Schema From:**
```
https://vmsantos44-zoho-api-backend.vercel.app/api/schema
```

**Authentication:** None (handled server-side via environment variables)

**Privacy Policy URL:**
```
https://vmsantos44-zoho-api-backend.vercel.app/api/privacy-policy-html
```

---

## 🎯 What Sara's GPT Will Do

### ✅ Main Features:
1. **Search Candidates** - Find contacts/leads by name or email
2. **Draft Personalized Emails** - Automatically reviews full history before writing
3. **Context Gathering** - Gets record details, communications, notes, attachments
4. **Proactive Alerts** - Flags overdue tasks, missing documents, unreplied emails
5. **Privacy Policy Access** - Answers candidate privacy questions
6. **Multi-language Support** - Portuguese, Spanish, English

### 🛡️ Security Guardrails:
- Never shares credentials or API keys
- Always shows email drafts before sending (requires confirmation)
- Requires approval for status updates
- Confirms before bulk operations (>5 records)
- Redacts sensitive data (SSN, passport numbers)
- Only accesses Contacts, Leads, Deals, Accounts modules

### 📧 Email Signature:
All emails will automatically use:
```
Best regards,

Sara Gomes
Talent Acquisition Specialist | Alfa Systems
+1 307 222 1996
sara.gomes@alfasystems.us
```

---

## 🚀 Testing Your GPT

After setup, try these test prompts:

### Test 1: Search Capability
```
"Search for William Santos"
```
**Expected:** GPT should search Leads and Contacts, return matches with Status, Tier, Email

### Test 2: Context Gathering
```
"Show me the complete profile for [candidate name]"
```
**Expected:** GPT should run 4 API calls (search → getRecord → getCommunications → getNotes)

### Test 3: Email Draft
```
"Draft a follow-up email for [candidate name]"
```
**Expected:**
1. Gathers full context first
2. Shows what it found (last email date, status, notes)
3. Drafts personalized email with specific references
4. Uses Sara's signature
5. Asks for confirmation before sending

### Test 4: Privacy Policy
```
"How long does Alfa Systems keep candidate data?"
```
**Expected:** Calls getPrivacyPolicy API, returns retention periods from policy

---

## 📊 Available API Endpoints

Your GPT has access to these endpoints:

| Endpoint | Purpose | Example Use |
|----------|---------|-------------|
| `/api/search-contact` | Search Contacts module | Find existing interpreters |
| `/api/search-lead` | Search Leads module | Find new candidates |
| `/api/get-record` | Get full record details | See all 50+ CRM fields |
| `/api/get-communications` | Email/call/task history | Review past interactions |
| `/api/get-notes` | Internal CRM notes | Read recruiter observations |
| `/api/list-attachments` | Documents on file | Verify resume/certificates |
| `/api/send-email` | Send email via CRM | Follow-ups, confirmations |
| `/api/privacy-policy` | Privacy policy data | Answer candidate questions |

---

## 🔧 Customization Options

### Add More Team Members:

To create GPTs for other team members, duplicate `CUSTOM_GPT_INSTRUCTIONS_SARA.md` and update:

1. **Team Member Identity** section (lines 3-16)
2. **Email signature** in Workflow Example (line 52)
3. Save as `CUSTOM_GPT_INSTRUCTIONS_[NAME].md`

### Adjust Character Limit:

Current: **7,951 / 8,000 characters** (49 chars remaining)

If you need to add more:
- Remove verbose examples
- Shorten edge case explanations
- Condense guardrails section

---

## ⚠️ Common Issues & Solutions

### Issue 1: "API call failed"
**Solution:** Check that Vercel deployment is live at https://vmsantos44-zoho-api-backend.vercel.app

### Issue 2: "No candidates found"
**Solution:** Verify candidate exists in Zoho CRM, check spelling

### Issue 3: "Character limit exceeded"
**Solution:** Instructions are already optimized at 7,951 chars. Do not add more content.

### Issue 4: Email signature not appearing
**Solution:** Check "Team Member Identity" section is at top of instructions

### Issue 5: GPT not gathering context
**Solution:** Verify "MANDATORY: Context Gathering" section is present in instructions

---

## 📝 Notes

- **Same API for All GPTs:** Sara's GPT, Gilda's GPT, Fabio's GPT can all use the same API endpoints
- **Personalization:** Only the instructions differ (name, email, signature)
- **Shared Access:** All team members see the same CRM data
- **Individual Identity:** Each GPT signs emails with the correct team member's name

---

## ✅ Setup Complete!

Once configured, Sara's Custom GPT will:
1. ✅ Search Zoho CRM for candidates
2. ✅ Draft personalized emails with full context
3. ✅ Use Sara's signature automatically
4. ✅ Follow security guardrails
5. ✅ Answer privacy policy questions

**Ready to deploy!** 🚀
