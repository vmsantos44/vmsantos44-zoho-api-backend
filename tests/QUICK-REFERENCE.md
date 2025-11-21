# API Error Testing - Quick Reference Card

## One-Line Commands

```bash
# Run all tests with full automation
cd /Users/santos/Downloads/zoho-crm-gpt/tests && ./run-tests.sh

# Run tests directly (no automation)
cd /Users/santos/Downloads/zoho-crm-gpt/tests && node api-error-tests.js

# View latest results
cat /Users/santos/Downloads/zoho-crm-gpt/tests/results/test-results-*.txt | tail -100

# List all results
ls -lht /Users/santos/Downloads/zoho-crm-gpt/tests/results/
```

## Understanding Output

| Symbol | Meaning |
|--------|---------|
| ✅ | Test passed |
| ❌ | Test failed |
| ⚠️ | Warning |
| 🔵 | Section header |

## Test Categories (92 total)

| Endpoint | Method | Tests | Key Focus |
|----------|--------|-------|-----------|
| /api/search-contact | GET | 8 | Missing params, method validation |
| /api/search-lead | GET | 4 | Similar to search-contact |
| /api/get-notes | GET | 7 | Module + recordId validation |
| /api/send-email | POST | 9 | JSON, large payloads, email validation |
| /api/list-attachments | POST | 7 | Required fields, malformed JSON |
| /api/get-attachment | POST | 7 | All 3 params required |
| /api/add-note | POST | 8 | Content validation, size limits |
| /api/get-record | GET | 9 | Module whitelist, case sensitivity |
| /api/get-communications | GET | 7 | Module validation, empty results |
| /api/privacy-policy | GET | 4 | Method validation only |
| Cross-cutting | - | 5 | CORS, headers, 404s |
| Rate limiting | - | 1 | DoS detection |

## Common Failures & Fixes

### Empty Parameter Accepted (Should Reject)

**Symptom:** `?searchTerm=` returns 200
**Fix:** Add validation: `if (!param || param.trim() === '')`

### Method Not Enforced

**Symptom:** POST works on GET endpoint
**Fix:** Add method check first in handler

### No Rate Limiting

**Symptom:** No 429 status codes
**Fix:** Add express-rate-limit or Vercel rate limiting

### Large Payloads Accepted

**Symptom:** 1MB+ payloads don't fail
**Fix:** Configure body parser limits

### Generic Error Messages

**Symptom:** "Internal Server Error" with no detail
**Fix:** Implement structured error responses

## Files Overview

| File | Purpose | Size |
|------|---------|------|
| `api-error-tests.js` | Main test suite | 950 lines |
| `run-tests.sh` | Automated runner | 150 lines |
| `test-results-template.md` | Results documentation | 400 lines |
| `README-TESTING.md` | Complete guide | 800 lines |
| `TEST-SUITE-SUMMARY.md` | Executive summary | 400 lines |
| `QUICK-REFERENCE.md` | This file | 100 lines |

## Results Location

```
tests/
├── results/
│   ├── test-results-YYYYMMDD_HHMMSS.txt
│   ├── test-results-YYYYMMDD_HHMMSS.md
│   └── test-results-YYYYMMDD_HHMMSS.tar.gz
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All tests passed |
| 1 | One or more tests failed |

## Immediate Security Actions

1. [ ] Add rate limiting (prevent DoS)
2. [ ] Validate empty strings (reject `param=`)
3. [ ] Add payload size limits (1MB max)
4. [ ] Sanitize error messages (no stack traces)
5. [ ] Review CORS configuration (not too permissive)

## Next Steps After Running

1. Review console output for failures
2. Fill in `test-results-template.md`
3. Document issues by severity
4. Create tickets for fixes
5. Re-run after fixes applied

## Getting Help

1. Check `README-TESTING.md` - Complete documentation
2. Check `TEST-SUITE-SUMMARY.md` - Overview
3. Review test output - Often shows exact issue
4. Check API logs - May reveal root cause

## Common Test Scenarios

### Testing a New Endpoint

1. Add test function to `api-error-tests.js`
2. Register in `runAllTests()`
3. Add to template in `test-results-template.md`
4. Run and verify

### Debugging a Failed Test

1. Note exact test name from output
2. Find test in `api-error-tests.js`
3. Run API request manually with curl
4. Compare expected vs actual
5. Update test or file bug

### Updating for API Changes

1. Identify changed endpoint
2. Update test assertions
3. Update documentation
4. Run full suite
5. Archive results

## Useful API URLs

- **API Base:** https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app
- **Health Check:** /api/privacy-policy (always returns 200)
- **Vercel Dashboard:** https://vercel.com/dashboard

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `fetch is not defined` | Upgrade to Node 18+ or install node-fetch |
| `Permission denied` | `chmod +x run-tests.sh` |
| API not reachable | Check deployment, network, URL |
| All tests fail | API may be down, check manually |
| Some tests fail | Document and investigate each |

---

**Last Updated:** 2025-11-19
**Version:** 1.0.0
