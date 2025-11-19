# Alfa Systems CRM Knowledge Base
## Complete Reference for Custom GPT Assistant

---

## Company Overview

**Alfa Systems** is an interpretation services company specializing in recruiting and managing interpreters across multiple languages. The company uses an automated AI-powered CRM system built on Zoho CRM with OpenAI GPT-4 integration for candidate processing.

---

## Candidate Processing System

### Automated Processing Flow
```
Zoho CRM (New Candidates)
  → Download Resumes
  → OpenAI GPT-4 Analysis
  → Tier Classification
  → Tag Assignment
  → CRM Updates
  → Review Reports
```

### Processing Capabilities
- ✅ Automatic resume download from Zoho CRM
- ✅ PDF/DOCX text extraction
- ✅ AI-powered tier classification (Tier 1/2/3)
- ✅ Language detection (Spanish, Portuguese, French, Haitian Creole, Swahili, English)
- ✅ Location detection (Onshore/Offshore)
- ✅ Automated CRM tagging
- ✅ Detailed analysis notes generation
- ✅ Batch review reports for HR team

---

## Tier Classification System

### Tier 1 - Highly Qualified
**Criteria:**
- 1+ years of Over-the-Phone Interpretation (OPI) experience
- 4+ hours of formal training
- Professional certifications preferred (CCHI, NBCMI)

**Processing Priority:** Fast-track for immediate placement

**Typical Timeline:** 1-2 weeks from application to active status

### Tier 2 - Qualified
**Criteria:**
- 1+ years of on-site interpretation experience
- Industry-specific training
- No certification required

**Processing Priority:** Standard processing

**Typical Timeline:** 2-4 weeks from application to active status

### Tier 3 - Entry Level
**Criteria:**
- Little to no formal experience
- Minimal or no training
- May have informal/volunteer interpretation experience
- Bilingual with strong language skills

**Processing Priority:** Training required before placement

**Typical Timeline:** 4-8 weeks from application to active status

---

## Location Classification

### Onshore
**Indicators:**
- US phone numbers
- US education history
- US work experience
- US-based addresses

**Benefits:**
- Can work standard US hours
- Direct deposit available
- Standard US tax withholding
- No international payment setup needed

### Offshore
**Indicators:**
- International phone numbers
- Foreign education/work history
- Non-US addresses

**Requirements:**
- International payment setup
- Different tax documentation (by country)
- May work flexible hours across time zones
- Additional compliance documentation

---

## Supported Languages

**Primary Markets:**
- Spanish (largest market)
- Portuguese (Brazilian Portuguese)
- French
- Haitian Creole
- Swahili
- Kinyarwanda (new)
- Somali (new)
- English (primary market language)

**Language Tags:** System automatically detects and applies language tags based on resume content and job application data.

---

## Candidate Status Workflow

### Standard Pipeline
1. **New Candidate** → Initial application received (starting point)
2. **Application Received** → Application under review by recruiter
3. **Interview Scheduled** → Interview set up with assigned recruiter
4. **Documents Pending** → Waiting for required documentation
5. **Onboarding** → Active onboarding process with paperwork/training
6. **Training** → Undergoing company-specific interpretation training
7. **Active Interpreter** → Fully onboarded and working assignments
8. **Not Qualified** → Did not meet minimum requirements

### Special Statuses
- **On Hold** → Temporarily paused (candidate request or company decision)
- **Reapply Later** → Not qualified currently, may reapply in 6-12 months
- **Duplicate** → Duplicate application (already exists in system)
- **Screening** → Under initial qualification screening

---

## CRM Fields Reference

### Contact/Lead Fields
- **Full_Name** / **First_Name** + **Last_Name** - Candidate name
- **Email** - Primary email (required)
- **Phone** / **Mobile** - Contact numbers
- **Status** - Current stage in pipeline
- **Tier** - Quality classification (1, 2, or 3)
- **Language** - Primary interpretation language(s)
- **Location** - City, State, Country
- **Candidate_Recruitment_Owner** - Assigned recruiter
- **Owner** - Fallback owner field
- **Created_Time** - Record creation timestamp
- **Modified_Time** - Last update timestamp

### Important Tags
**Tier Tags:**
- Tier 1, Tier 2, Tier 3

**Location Tags:**
- Onshore (US-based)
- Offshore (International)

**Language Tags:**
- Spanish, Portuguese, French, Haitian Creole, Swahili, Kinyarwanda, Somali

**System Tags:**
- Automated AI Review (processed by AI system)
- Documents Downloaded (resume on file)
- No Resume (no resume attached)
- Qualified / Not Qualified

---

## Automated Systems

### 1. Candidate Processing System
**Frequency:** Daily at 9:00 AM EST
**What it does:**
- Fetches all candidates with status "New"
- Downloads resumes from Zoho CRM
- Analyzes with OpenAI GPT-4
- Assigns tier classification
- Updates CRM with tags and notes
- Generates batch review reports

**Files Generated:**
- `data/batch-reviews/MASTER_REVIEW_LIST.txt` - Summary
- `data/batch-reviews/batch_XX_YYYYMMDD_HHMMSS.txt` - Individual batches
- `data/processing-results/ai_processing_results_*.json` - Detailed logs

### 2. Complaint Detection System
**Frequency:** Hourly
**What it does:**
- Monitors Zoho CRM emails for complaint keywords
- Detects negative sentiment using Zoho's sentiment analysis
- Auto-sends acknowledgment emails to complainants
- CCs assigned recruiter
- Generates AI-powered response drafts
- Tracks in SQLite database to prevent duplicates

**Priority Levels:**
- High: Urgent language, threats, legal mentions
- Medium: Standard complaints, dissatisfaction
- Low: Minor concerns, questions

### 3. Unreplied Email Detection System
**Frequency:** Every 2 hours
**What it does:**
- Identifies emails without replies (>6 hours, <3 days)
- Determines responsible party from record owner fields
- Sends context-aware alerts
- Generates AI response suggestions
- Uses OpenAI for personalized draft responses

**Owner Field Hierarchy:**
1. Candidate_Recruitment_Owner (primary)
2. Owner field (fallback)

**Special Owner Assignments:**
- Gilda → Payments and financial processing
- Fábio → Contracts and legal documentation
- Edon → Technical support and platform issues
- Ricky → Client cloud and enterprise accounts

### 4. QA Verification System
**Purpose:** Quality assurance for AI candidate analysis
**What it verifies:**
- Tier classification accuracy
- Location determination validity
- Qualification status appropriateness
- Internal consistency (strengths/red flags vs tier)

**Confidence Scoring:** High, Medium, Low
**Output:** Interactive HTML dashboard at `data/qa_metrics_dashboard.html`

### 5. AI Notes Summarizer
**Usage:** Manual trigger or button in CRM
**What it does:**
- Retrieves all notes from Leads or Contacts module
- Auto-translates Portuguese, French, Spanish to English
- Converts all timestamps to Europe/Lisbon timezone
- Generates structured summaries:
  - Overall summary (3-6 sentences)
  - Key dates (chronological milestones)
  - Next steps (actionable items)
  - Notes timeline (one-line summaries)
- Posts summary back to CRM as new note

**Cost:** ~$0.01-0.03 per summary

### 6. Master Orchestrator
**Purpose:** Coordinates all automation systems
**Execution Order:**
1. Complaint Detection
2. Unreplied Email Detection
3. Candidate Processing
4. QA Verification
5. Unified Reporting

**Configuration:** `config/orchestrator_config.json`

---

## Required Documents (By Tier)

### All Candidates
1. Valid government-issued ID (passport, driver's license)
2. Resume/CV
3. Social Security Number or Tax ID
4. Proof of language proficiency

### Tier 1/2 Additional Requirements
5. Interpretation certifications (if applicable)
6. Training certificates
7. Professional references (2-3 required)
8. Work authorization documents

### Offshore Candidates Additional
9. Passport copy
10. Tax documentation for country of residence
11. Banking information for international payments
12. Additional compliance forms (varies by country)

---

## Common Abbreviations

- **OPI** - Over-the-Phone Interpretation
- **VRI** - Video Remote Interpretation
- **CCHI** - Certification Commission for Healthcare Interpreters
- **NBCMI** - National Board of Certification for Medical Interpreters
- **LSP** - Language Service Provider
- **TI** - Telephonic Interpretation
- **CRM** - Customer Relationship Management (Zoho CRM)

---

## Email Templates (Recruiter Use)

### Welcome Email - Tier 1 Candidate
**Subject:** Welcome to Alfa Systems - Fast Track Opportunity

**Body:**
```
Hi [First_Name],

Welcome to Alfa Systems! We're excited to review your application.

Based on your [X years] of OPI experience and professional certifications, you're an excellent fit for our Tier 1 interpreter positions.

Next Steps:
1. Complete the attached onboarding documents
2. Schedule your brief screening interview: [LINK]
3. Upload relevant certifications to your profile

Timeline: Most Tier 1 candidates complete onboarding within 1-2 weeks and start receiving assignments shortly after.

Questions? Reply to this email or call us at [PHONE].

Best regards,
[Recruiter Name]
Alfa Systems Recruitment Team
```

### Welcome Email - Tier 2/3 Candidate
**Subject:** Welcome to Alfa Systems - Application Received

**Body:**
```
Hi [First_Name],

Thank you for applying to Alfa Systems as a [Language] interpreter!

We've received your application and are reviewing your qualifications.

What to Expect:
- Application review: 3-5 business days
- Interview (if selected): Week of [DATE]
- Training: 2-4 weeks (if needed)
- Onboarding: Approximately 4-6 weeks total

We're particularly interested in your [Language] skills and [mention relevant experience].

We'll be in touch soon with next steps.

Best regards,
[Recruiter Name]
Alfa Systems Recruitment Team
```

### Document Request Follow-Up
**Subject:** Documents Needed - [Full_Name]

**Body:**
```
Hi [First_Name],

I hope you're doing well! To continue with your onboarding, we still need the following:

[ ] Valid government-issued ID
[ ] Updated resume/CV
[ ] [Certifications if applicable]
[ ] [Other specific documents]

Please upload these at your earliest convenience:
- Reply to this email with attachments, or
- Upload to your candidate portal: [LINK]

Let me know if you have any questions or need assistance!

Best regards,
[Recruiter Name]
```

### Interview Reminder
**Subject:** Reminder: Interview Tomorrow at [TIME]

**Body:**
```
Hi [First_Name],

Quick reminder about your interview scheduled for tomorrow:

📅 Date: [DATE]
⏰ Time: [TIME] [TIMEZONE]
📞 Format: [Phone/Video/In-Person]
🔗 Link: [IF VIDEO CALL]

What to Prepare:
- Your interpretation experience and background
- Questions about our platform and assignments
- Your availability for potential training dates

Looking forward to speaking with you!

Best regards,
[Recruiter Name]
```

### Professional Rejection (Not Qualified)
**Subject:** Thank you for your interest in Alfa Systems

**Body:**
```
Hi [First_Name],

Thank you for taking the time to apply to Alfa Systems.

After careful review of your application, we've decided not to move forward at this time. This decision is based on [our current needs/experience requirements/high volume of qualified applications].

We encourage you to:
- Gain additional interpretation experience (1+ years recommended)
- Pursue relevant certifications (CCHI, NBCMI)
- Consider formal interpretation training programs
- Reapply in 6-12 months after gaining more experience

We appreciate your interest and wish you the best in your interpretation career.

Best regards,
[Recruiter Name]
Alfa Systems Recruitment Team
```

---

## Best Practices for CRM Use

### Email Communication
1. **Always personalize** - Use first name, reference specific situation
2. **Be specific about next steps** - Clear actions, deadlines, expectations
3. **Professional but friendly** - Balance professionalism with approachability
4. **Respect language preferences** - Use Portuguese/Spanish when appropriate
5. **Response time** - Same-day response during business hours

### CRM Data Entry
1. **Always tag tier level** - Critical for prioritization and routing
2. **Add location tag** - Onshore vs Offshore affects processing
3. **Note language tags** - Multiple languages possible per candidate
4. **Update status promptly** - Keeps pipeline metrics accurate
5. **Add detailed notes** - Future recruiters/AI systems need context

### Candidate Experience
1. **Set clear expectations** - Timeline, requirements, what comes next
2. **Follow up regularly** - Don't let candidates go silent
3. **Be honest about timeline** - Under-promise, over-deliver
4. **Provide constructive feedback** - Even for rejections
5. **Maintain professionalism** - Every interaction reflects the company

---

## Troubleshooting Common Issues

### Candidate Not Responding
1. Check last contact date in CRM notes
2. Try alternate contact method (phone vs email)
3. Send follow-up with clear deadline (48-72 hours)
4. If no response in 7 days → Status: "On Hold" with note
5. If no response in 14 days → Status: "Not Qualified" or "Reapply Later"

### Missing Documents
1. Check Zoho CRM attachments section first
2. Review notes for previous document requests
3. Send specific list of missing items with examples
4. Provide multiple upload options (email, portal)
5. Set reasonable deadline (48-72 hours for simple docs)

### Duplicate Applications
1. Search both Contacts and Leads modules
2. Check email address (most reliable unique identifier)
3. Review creation dates and data quality
4. Merge duplicates (keep record with most complete data)
5. Tag original as "Duplicate" with note referencing primary record

### Wrong Tier Assignment
1. Review AI analysis notes for justification
2. Check actual years of OPI experience
3. Verify certifications claimed vs attached
4. Use QA verification system for second opinion
5. Update tier tag and add correction note

---

## System Metrics and KPIs

### Processing Performance
- **Average processing time:** 18-20 seconds per candidate
- **Batch size:** 20 candidates per batch
- **AI analysis cost:** ~$0.01-0.02 per resume
- **Automation schedule:** Daily at 9:00 AM EST

### Recruiter Performance Targets
- **Response time:** < 24 hours for first contact
- **Time to interview:** < 5 days (Tier 1), < 10 days (Tier 2/3)
- **Onboarding completion rate:** 80%+ target
- **Time to active:** 2 weeks (Tier 1), 4 weeks (Tier 2), 6 weeks (Tier 3)

### Pipeline Health Targets
- **Tier distribution goal:** 20% Tier 1, 50% Tier 2, 30% Tier 3
- **Language distribution:** Match to client demand
- **Onshore/Offshore ratio:** Balance based on business needs

---

## AI System Technical Details

### OpenAI Model Used
- **Model:** GPT-4o (fast, accurate)
- **Temperature:** 0.3 for candidate analysis (consistent results)
- **Temperature:** 0.7 for complaint responses (more empathetic/creative)
- **Temperature:** 0.2 for QA verification (very consistent)

### Resume Text Extraction
- **PDF:** pdfplumber (primary), PyPDF2 (fallback)
- **DOCX:** python-docx
- **Fallback:** Uses "Job Application Data" field if no resume attached

### Authentication
- **OAuth 2.0** refresh token flow
- **Token storage:** `~/.zoho_env` (local), `.zoho_env` (GitHub Actions)
- **Auto-refresh:** Tokens refreshed automatically when expired
- **Token lifespan:** Access tokens expire after 1 hour, refresh tokens last 1 year

---

## Important File Locations

### Configuration
- `config/all_tags.json` - Tag ID mappings (critical for tagging)
- `config/config.json` - Main Zoho CRM settings
- `config/orchestrator_config.json` - Master orchestrator configuration
- `~/.zoho_env` - Credentials (local development)

### Data Storage
- `data/batch-reviews/` - Human-readable review files
- `data/processing-results/` - Detailed JSON analysis
- `data/complaint_processing.db` - SQLite complaint tracking
- `data/unreplied_email_processing.db` - SQLite unreplied email tracking
- `data/qa_metrics_dashboard.html` - QA verification dashboard
- `resumes/` - Temporary resume storage (auto-cleaned)

### Logs
- `logs/processor_output.log` - Candidate processing logs
- `logs/processor_error.log` - Error logs
- `logs/orchestrator/` - Master orchestrator logs

---

## Integration Points

### Zoho CRM Modules Used
- **Leads** - New candidate applications
- **Contacts** - Converted candidates/active interpreters
- **Tasks** - Follow-up assignments
- **Notes** - Candidate interaction history
- **Emails** - All email communications tracked

### Zoho CRM API Endpoints
- Search (Contacts, Leads)
- Get Record Details
- Get Notes (for any module)
- Update Record (tags, status, fields)
- Send Email
- Download Attachments

### External Integrations
- **OpenAI GPT-4** - Resume analysis, complaint responses, QA verification
- **SMTP** - Email notifications and reporting
- **GitHub Actions** - Automated daily processing (9 AM EST)

---

**Last Updated:** November 2025
**System Version:** 1.0
**Maintained By:** Alfa Systems CRM Team
**AI Processing Model:** OpenAI GPT-4o
