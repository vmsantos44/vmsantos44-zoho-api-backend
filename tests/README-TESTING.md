# Zoho CRM GPT API - Error Testing Documentation

This directory contains a comprehensive error testing suite for the Zoho CRM GPT API backend deployed at:

**API URL:** https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app

## Overview

The test suite validates error handling across all 10 API endpoints, ensuring proper HTTP status codes, error messages, and security practices.

### What Gets Tested

1. **Missing Required Parameters** - Validates that endpoints reject requests without required fields
2. **Invalid Data Types** - Tests handling of wrong data types (strings instead of numbers, etc.)
3. **Invalid Module Names** - For CRM endpoints, tests rejection of invalid module names
4. **Invalid Record IDs** - Tests handling of malformed and non-existent record IDs
5. **HTTP Method Validation** - Ensures only allowed methods work (GET vs POST)
6. **Malformed JSON** - Tests POST endpoints with invalid JSON bodies
7. **Large Payloads** - Tests handling of extremely large request bodies
8. **Edge Cases** - Empty strings, null values, undefined parameters
9. **CORS Configuration** - Validates cross-origin resource sharing
10. **Rate Limiting** - Detects if rate limiting is implemented

## Files in This Directory

### 1. `api-error-tests.js`

The main test suite written in Node.js using native fetch API.

**Features:**
- Color-coded console output (✅ green for pass, ❌ red for fail)
- Comprehensive error scenarios for each endpoint
- Automatic API health check before testing
- Detailed error reporting
- Summary statistics (total, passed, failed, duration)
- Exit codes (0 = all passed, 1 = failures detected)

**Test Organization:**
- One test suite per endpoint
- Cross-cutting concerns (CORS, content-type, etc.)
- Rate limiting detection
- ~90+ individual test cases

### 2. `test-results-template.md`

Markdown template for documenting test results.

**Sections:**
- Summary table with pass/fail counts
- Detailed test results per endpoint
- Issues discovered (organized by severity)
- Security concerns checklist
- Recommendations for improvements
- Test environment details

### 3. `run-tests.sh`

Bash script to execute tests with automation.

**Features:**
- Prerequisite checking (Node.js installation)
- API availability check
- Automatic results directory creation
- Timestamped result files
- Markdown report generation
- Archive creation (tar.gz)
- Cleanup of old results (keeps last 10)
- Color-coded output

### 4. `README-TESTING.md` (this file)

Complete documentation for the testing system.

## Quick Start

### Prerequisites

- **Node.js** v14 or higher (native fetch API support requires v18+)
- **curl** (for API health checks in bash script)
- **bash** shell (macOS/Linux)

### Installation

No installation required! The test suite uses Node.js native APIs only.

If you're using Node.js < v18, install node-fetch:

```bash
npm install node-fetch
```

Then modify the top of `api-error-tests.js`:

```javascript
// Add this at the top if Node < v18
import fetch from 'node-fetch';
```

### Running Tests

#### Option 1: Using the Bash Script (Recommended)

```bash
cd /Users/santos/Downloads/zoho-crm-gpt/tests
chmod +x run-tests.sh
./run-tests.sh
```

**What it does:**
1. Checks prerequisites
2. Validates API availability
3. Runs all tests
4. Saves results to `results/` directory
5. Creates markdown template with timestamp
6. Archives results
7. Cleans up old results

#### Option 2: Direct Node Execution

```bash
cd /Users/santos/Downloads/zoho-crm-gpt/tests
node api-error-tests.js
```

**Use this for:**
- Quick ad-hoc testing
- Debugging specific tests
- CI/CD pipeline integration

#### Option 3: Make Executable and Run

```bash
cd /Users/santos/Downloads/zoho-crm-gpt/tests
chmod +x api-error-tests.js
./api-error-tests.js
```

## Understanding Test Output

### Console Output Format

```
🧪 Testing /api/search-contact errors...
============================================================

✓ Missing searchTerm parameter
✓ Empty searchTerm parameter
✓ POST method not allowed
✗ Invalid limit parameter (non-numeric)
  Error: Expected status 400, got 200
```

**Symbols:**
- ✓ (green) = Test passed
- ✗ (red) = Test failed
- ⚠ (yellow) = Warning or informational

### Summary Section

```
============================================================
TEST SUMMARY

Total Tests:  92
Passed:       87
Failed:       5
Skipped:      0

Duration:     12.34s
Completed:    2025-11-19T15:30:00.000Z
```

### Failed Tests Details

If tests fail, detailed error information is displayed:

```
FAILED TESTS:

1. Invalid limit parameter (non-numeric)
   Error: Expected status 400, got 200

2. Extremely long body (1MB+)
   Error: Expected status 413, got 500
```

## Test Coverage by Endpoint

### 1. GET /api/search-contact (8 tests)

- Missing searchTerm parameter
- Empty searchTerm
- POST/PUT/DELETE method rejection
- Invalid/negative/huge limit values

**Key Validations:**
- Required parameter enforcement
- HTTP method restrictions
- Input sanitization

### 2. GET /api/search-lead (4 tests)

- Missing/empty searchTerm
- Method validation
- Invalid limit handling

### 3. GET /api/get-notes (7 tests)

- Missing module/recordId
- Empty parameters
- Invalid recordId formats
- Method validation

**Key Validations:**
- Both parameters required
- RecordId format validation

### 4. POST /api/send-email (9 tests)

- Missing toAddress/subject/body
- Invalid email formats
- Malformed JSON
- Empty strings
- Extremely large payloads (1MB+)

**Key Validations:**
- Email format validation
- JSON parsing
- Payload size limits
- Required field enforcement

### 5. POST /api/list-attachments (7 tests)

- Missing module/record_id
- Invalid module names
- Malformed JSON
- Null values
- Method validation

### 6. POST /api/get-attachment (7 tests)

- Missing module/record_id/attachment_id
- Invalid attachment IDs
- Non-existent attachments
- Method validation

**Key Validations:**
- All three parameters required
- Attachment existence checking

### 7. POST /api/add-note (8 tests)

- Missing module/record_id/note_content
- Empty note_content
- Extremely long notes (100KB+)
- Invalid modules
- Method validation

**Key Validations:**
- Content presence
- Content length limits
- Module validation

### 8. GET /api/get-record (9 tests)

- Missing module/recordId
- Invalid module (validates against whitelist)
- Non-existent records
- Invalid recordId formats
- Case sensitivity
- Empty parameters

**Key Validations:**
- Module whitelist enforcement
- Record existence
- Case-sensitive module names

### 9. GET /api/get-communications (7 tests)

- Missing parameters
- Invalid modules
- Non-existent records
- Invalid recordId formats

**Key Validations:**
- Module whitelist
- Graceful handling of empty results

### 10. GET /api/privacy-policy (4 tests)

- POST/PUT/DELETE method rejection
- Valid GET request
- Static content validation

### Cross-Cutting Concerns (5 tests)

- CORS headers presence
- JSON content-type
- 404 for non-existent endpoints
- Root path handling
- OPTIONS request (CORS preflight)

### Rate Limiting (1 test)

- 20 rapid sequential requests
- Detects 429 status codes
- Informational only (doesn't fail)

## Interpreting Results

### Expected Behaviors

#### Good Error Handling

```javascript
// Missing parameter
{
  "error": "searchTerm parameter is required"
}
// Status: 400 Bad Request
```

```javascript
// Invalid module
{
  "error": "Invalid module. Must be one of: Contacts, Leads, Deals, Accounts"
}
// Status: 400 Bad Request
```

```javascript
// Method not allowed
{
  "error": "Method not allowed"
}
// Status: 405 Method Not Allowed
```

#### Concerning Behaviors

⚠️ **Exposing Internal Details**
```javascript
{
  "error": "Error: connect ECONNREFUSED 10.0.0.5:3306",
  "stack": "Error at Connection.connect (/app/lib/db.js:25)"
}
```
**Issue:** Reveals internal infrastructure

⚠️ **Missing Validation**
```javascript
// Request: searchTerm=""
// Response: 200 OK with empty results
```
**Issue:** Should return 400 for empty required parameter

⚠️ **Generic Errors**
```javascript
{
  "error": "Internal Server Error"
}
// Status: 500
```
**Issue:** Too generic, no actionable information

### Common Failure Patterns

#### Pattern 1: Insufficient Input Validation

**Symptom:** Empty strings accepted, invalid formats processed

**Example:**
```javascript
// Should fail but returns 200
GET /api/search-contact?searchTerm=
```

**Fix:** Add validation:
```javascript
if (!searchTerm || searchTerm.trim() === '') {
  return res.status(400).json({ error: 'searchTerm parameter is required and cannot be empty' });
}
```

#### Pattern 2: Method Not Allowed Not Enforced

**Symptom:** POST works on GET endpoints or vice versa

**Example:**
```javascript
// Should return 405 but returns 200 or 400
POST /api/search-contact
```

**Fix:** Add method check first:
```javascript
if (req.method !== 'GET') {
  return res.status(405).json({ error: 'Method not allowed. Use GET.' });
}
```

#### Pattern 3: Missing Rate Limiting

**Symptom:** No 429 status codes on rapid requests

**Impact:** Vulnerable to DoS attacks

**Fix:** Implement rate limiting middleware

#### Pattern 4: Large Payload Acceptance

**Symptom:** 1MB+ payloads accepted without error

**Impact:** Memory exhaustion, DoS vulnerability

**Fix:** Configure body size limits:
```javascript
// In Next.js API route config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
```

## Adding New Tests

### Step 1: Identify Test Scenario

Determine what error case you want to test:
- Missing parameter?
- Invalid data type?
- Edge case?

### Step 2: Write Test Case

Add to the appropriate test suite function:

```javascript
async function testYourEndpointErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/your-endpoint${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Your test case
  await testCase('Description of what you are testing', async () => {
    const response = await fetch(`${API_BASE_URL}/api/your-endpoint?param=invalid`);
    const data = await response.json();

    // Assertions
    assertStatus(response.status, 400);
    assertHasError(data);
    assert(data.error.includes('expected text'), 'Error message validation');
  });

  // More test cases...
}
```

### Step 3: Register Test Suite

Add your test suite to the main runner:

```javascript
async function runAllTests() {
  // ... existing code ...

  await testYourEndpointErrors();  // Add this

  // ... rest of code ...
}
```

### Step 4: Update Template

Add your test cases to `test-results-template.md`:

```markdown
### N. METHOD /api/your-endpoint

| Test Case | Expected Result | Actual Result | Status | Notes |
|-----------|----------------|---------------|--------|-------|
| Your test case | 400 Bad Request | | ⬜ | |
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: API Error Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Run API Error Tests
      working-directory: ./tests
      run: |
        chmod +x api-error-tests.js
        node api-error-tests.js

    - name: Upload Test Results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: tests/results/
        retention-days: 30
```

### Jenkins Pipeline Example

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests') {
            steps {
                dir('tests') {
                    sh 'node api-error-tests.js'
                }
            }
        }

        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'tests/results/**', fingerprint: true
            }
        }
    }

    post {
        always {
            junit 'tests/results/*.xml'  // If you add XML output
        }
    }
}
```

## Security Testing Checklist

Use this checklist after running tests:

- [ ] **Authentication Bypass**: Can endpoints be accessed without auth?
- [ ] **Authorization Issues**: Can users access other users' data?
- [ ] **SQL Injection**: Do endpoints sanitize inputs?
- [ ] **XSS Vulnerabilities**: Are outputs properly escaped?
- [ ] **CSRF Protection**: Are state-changing operations protected?
- [ ] **Rate Limiting**: Is there protection against abuse?
- [ ] **Information Disclosure**: Do errors reveal sensitive info?
- [ ] **CORS Misconfiguration**: Are CORS headers too permissive?
- [ ] **Insecure Direct Object References**: Can IDs be enumerated?
- [ ] **Mass Assignment**: Can unexpected fields be set?
- [ ] **Server-Side Request Forgery**: Can internal resources be accessed?
- [ ] **XXE (XML External Entity)**: If XML is used, is it safe?

## Troubleshooting

### Test Failures

#### "fetch is not defined"

**Cause:** Node.js version < 18

**Fix:**
```bash
# Check version
node --version

# Update Node.js or install node-fetch
npm install node-fetch
```

#### "API is not reachable"

**Cause:** API is down or network issues

**Fix:**
1. Check API URL in browser
2. Verify internet connection
3. Check if API is deployed
4. Review Vercel deployment logs

#### "Cannot find module"

**Cause:** Missing dependencies

**Fix:**
```bash
npm install
```

#### "Permission denied" on run-tests.sh

**Cause:** Script not executable

**Fix:**
```bash
chmod +x run-tests.sh
```

### Understanding False Positives

Some tests may fail due to legitimate API design choices:

**Example:** Empty searchTerm returns 200 with empty array instead of 400

**Analysis:**
- Not necessarily wrong
- Some APIs treat empty query as "match nothing"
- Document as intended behavior if confirmed

**Action:** Update test expectations or flag for review

## Best Practices

### When to Run Tests

1. **Before Deployment** - Catch regressions
2. **After Code Changes** - Validate fixes
3. **Scheduled (Daily/Weekly)** - Monitor API health
4. **After Security Advisories** - Verify vulnerabilities patched

### Test Maintenance

1. **Review Monthly** - Update for new endpoints
2. **Update Assertions** - As API evolves
3. **Archive Results** - Track trends over time
4. **Document Changes** - Note API behavior changes

### Reporting Issues

When reporting issues from tests:

1. **Include Test Name** - Exact test that failed
2. **Show Request** - Full HTTP request details
3. **Show Response** - Complete response
4. **Expected vs Actual** - Clear comparison
5. **Environment** - Node version, OS, timestamp
6. **Reproducibility** - How often it fails

## Advanced Usage

### Running Specific Test Suites

Modify `api-error-tests.js` to comment out test suites:

```javascript
async function runAllTests() {
  // ... health check ...

  await testSearchContactErrors();
  // await testSearchLeadErrors();  // Comment out to skip
  // await testGetNotesErrors();     // Comment out to skip
  await testSendEmailErrors();       // Keep this one

  // ... summary ...
}
```

### Custom Assertions

Add your own assertion helpers:

```javascript
function assertErrorMessage(response, expectedSubstring) {
  assert(
    response.error && response.error.includes(expectedSubstring),
    `Error message should contain "${expectedSubstring}"`
  );
}
```

### Parallel Test Execution

For faster testing, run test suites in parallel:

```javascript
async function runAllTests() {
  await checkAPIHealth();

  // Run in parallel
  await Promise.all([
    testSearchContactErrors(),
    testSearchLeadErrors(),
    testGetNotesErrors(),
    // ... etc
  ]);

  // Print summary
}
```

**Caution:** May trigger rate limiting

### Environment Variables

Configure tests via environment variables:

```bash
export API_BASE_URL="https://staging-api.example.com"
export TEST_TIMEOUT=5000
export SKIP_SLOW_TESTS=true

node api-error-tests.js
```

Update `api-error-tests.js`:

```javascript
const API_BASE_URL = process.env.API_BASE_URL || 'https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app';
const TEST_TIMEOUT = parseInt(process.env.TEST_TIMEOUT) || 10000;
```

## Resources

### Related Documentation

- [Main API README](/Users/santos/Downloads/zoho-crm-gpt/README.md)
- [Custom GPT Setup Guide](/Users/santos/Downloads/zoho-crm-gpt/CUSTOM_GPT_SETUP_GUIDE.md)
- [GPT Schema](/Users/santos/Downloads/zoho-crm-gpt/gpt-schema.json)

### External Resources

- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Node.js Fetch API](https://nodejs.org/dist/latest-v18.x/docs/api/globals.html#fetch)

## Support

For issues or questions:

1. Check this README first
2. Review test output carefully
3. Consult API documentation
4. Contact API maintainer

## License

This test suite is part of the Zoho CRM GPT API project.

---

**Last Updated:** 2025-11-19

**Version:** 1.0.0

**Maintainer:** Alfa Systems LLC
