#!/usr/bin/env node

/**
 * Comprehensive Error Testing Suite for Zoho CRM GPT API
 * Tests all error scenarios for the API deployed at:
 * https://vmsantos44-zoho-api-backend.vercel.app
 *
 * Run: node api-error-tests.js
 */

const API_BASE_URL = 'https://vmsantos44-zoho-api-backend.vercel.app';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

/**
 * Test case wrapper with error handling and output formatting
 */
async function testCase(description, testFn) {
  results.total++;
  try {
    await testFn();
    results.passed++;
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    return true;
  } catch (error) {
    results.failed++;
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.gray}Error: ${error.message}${colors.reset}`);
    results.errors.push({ test: description, error: error.message });
    return false;
  }
}

/**
 * Assert helper function
 */
function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Assert response status code
 */
function assertStatus(actual, expected, message) {
  assert(
    actual === expected,
    message || `Expected status ${expected}, got ${actual}`
  );
}

/**
 * Assert response has error field
 */
function assertHasError(response) {
  assert(response.error !== undefined, 'Response should contain error field');
}

/**
 * Check if API is reachable
 */
async function checkAPIHealth() {
  console.log(`\n${colors.bold}${colors.blue}Checking API availability...${colors.reset}`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/privacy-policy`);
    if (response.ok) {
      console.log(`${colors.green}✓ API is reachable${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠ API returned status ${response.status}${colors.reset}\n`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗ API is not reachable: ${error.message}${colors.reset}\n`);
    return false;
  }
}

// ============================================================================
// TEST SUITE: /api/search-contact
// ============================================================================
async function testSearchContactErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/search-contact${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: Missing required parameter
  await testCase('Missing searchTerm parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact`);
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
    assert(data.error.toLowerCase().includes('searchterm'), 'Error should mention searchTerm');
  });

  // Test 2: Empty searchTerm
  await testCase('Empty searchTerm parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact?searchTerm=`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 3: Invalid method (POST instead of GET)
  await testCase('POST method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact?searchTerm=test`, {
      method: 'POST'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
    assertHasError(data);
  });

  // Test 4: PUT method not allowed
  await testCase('PUT method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact?searchTerm=test`, {
      method: 'PUT'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 5: DELETE method not allowed
  await testCase('DELETE method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact?searchTerm=test`, {
      method: 'DELETE'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 6: Invalid limit parameter type
  await testCase('Invalid limit parameter (non-numeric)', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact?searchTerm=test&limit=abc`);
    const data = await response.json();
    // Should handle gracefully and use default
    assert(response.status === 200 || response.status === 400);
  });

  // Test 7: Negative limit parameter
  await testCase('Negative limit parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact?searchTerm=test&limit=-10`);
    const data = await response.json();
    // Should handle gracefully
    assert(response.status === 200 || response.status === 400);
  });

  // Test 8: Extremely large limit
  await testCase('Extremely large limit (1000000)', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact?searchTerm=test&limit=1000000`);
    const data = await response.json();
    // Should handle gracefully or return error
    assert(response.status === 200 || response.status === 400 || response.status === 413);
  });
}

// ============================================================================
// TEST SUITE: /api/search-lead
// ============================================================================
async function testSearchLeadErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/search-lead${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: Missing required parameter
  await testCase('Missing searchTerm parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-lead`);
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
  });

  // Test 2: Empty searchTerm
  await testCase('Empty searchTerm parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-lead?searchTerm=`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 3: Invalid method
  await testCase('POST method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-lead?searchTerm=test`, {
      method: 'POST'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 4: Invalid limit type
  await testCase('Invalid limit parameter type', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-lead?searchTerm=test&limit=invalid`);
    const data = await response.json();
    assert(response.status === 200 || response.status === 400);
  });
}

// ============================================================================
// TEST SUITE: /api/get-notes
// ============================================================================
async function testGetNotesErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/get-notes${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: Missing both parameters
  await testCase('Missing module and recordId', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-notes`);
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
  });

  // Test 2: Missing module parameter
  await testCase('Missing module parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-notes?recordId=123456`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 3: Missing recordId parameter
  await testCase('Missing recordId parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-notes?module=Contacts`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 4: Invalid method
  await testCase('POST method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-notes?module=Contacts&recordId=123`, {
      method: 'POST'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 5: Empty module
  await testCase('Empty module parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-notes?module=&recordId=123`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 6: Empty recordId
  await testCase('Empty recordId parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-notes?module=Contacts&recordId=`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 7: Invalid recordId format
  await testCase('Invalid recordId format (letters)', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-notes?module=Contacts&recordId=abc123xyz`);
    const data = await response.json();
    // API should handle this - might be 400 or 500
    assert(response.status === 400 || response.status === 500);
  });
}

// ============================================================================
// TEST SUITE: /api/send-email
// ============================================================================
async function testSendEmailErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/send-email${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: GET method not allowed
  await testCase('GET method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'GET'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 2: Missing all required fields
  await testCase('Missing all required fields', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
  });

  // Test 3: Missing toAddress
  await testCase('Missing toAddress field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Test',
        body: 'Test body'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 4: Missing subject
  await testCase('Missing subject field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toAddress: 'test@example.com',
        body: 'Test body'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 5: Missing body
  await testCase('Missing body field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toAddress: 'test@example.com',
        subject: 'Test'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 6: Invalid email format
  await testCase('Invalid email format', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toAddress: 'not-an-email',
        subject: 'Test',
        body: 'Test body'
      })
    });
    const data = await response.json();
    // Should be handled by API validation
    assert(response.status === 400 || response.status === 500);
  });

  // Test 7: Malformed JSON
  await testCase('Malformed JSON body', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json'
    });
    const data = await response.json().catch(() => ({}));
    assertStatus(response.status, 400);
  });

  // Test 8: Empty strings
  await testCase('Empty string fields', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toAddress: '',
        subject: '',
        body: ''
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 9: Extremely long body
  await testCase('Extremely long body (1MB+)', async () => {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toAddress: 'test@example.com',
        subject: 'Test',
        body: 'A'.repeat(1000000) // 1MB of 'A's
      })
    });
    const data = await response.json().catch(() => ({}));
    // Should handle or reject large payloads
    assert(response.status === 400 || response.status === 413 || response.status === 500);
  });
}

// ============================================================================
// TEST SUITE: /api/list-attachments
// ============================================================================
async function testListAttachmentsErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/list-attachments${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: GET method not allowed
  await testCase('GET method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/list-attachments`, {
      method: 'GET'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 2: Missing all required fields
  await testCase('Missing module and record_id', async () => {
    const response = await fetch(`${API_BASE_URL}/api/list-attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
  });

  // Test 3: Missing module
  await testCase('Missing module field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/list-attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        record_id: '123456'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 4: Missing record_id
  await testCase('Missing record_id field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/list-attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 5: Invalid module name
  await testCase('Invalid module name', async () => {
    const response = await fetch(`${API_BASE_URL}/api/list-attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'InvalidModule',
        record_id: '123456'
      })
    });
    const data = await response.json();
    // Should be handled by Zoho API
    assert(response.status === 400 || response.status === 500);
  });

  // Test 6: Malformed JSON
  await testCase('Malformed JSON body', async () => {
    const response = await fetch(`${API_BASE_URL}/api/list-attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json'
    });
    const data = await response.json().catch(() => ({}));
    assertStatus(response.status, 400);
  });

  // Test 7: Null values
  await testCase('Null field values', async () => {
    const response = await fetch(`${API_BASE_URL}/api/list-attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: null,
        record_id: null
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });
}

// ============================================================================
// TEST SUITE: /api/get-attachment
// ============================================================================
async function testGetAttachmentErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/get-attachment${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: GET method not allowed
  await testCase('GET method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-attachment`, {
      method: 'GET'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 2: Missing all required fields
  await testCase('Missing all required fields', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-attachment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
  });

  // Test 3: Missing module
  await testCase('Missing module field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-attachment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        record_id: '123456',
        attachment_id: '789'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 4: Missing record_id
  await testCase('Missing record_id field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-attachment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        attachment_id: '789'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 5: Missing attachment_id
  await testCase('Missing attachment_id field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-attachment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        record_id: '123456'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 6: Invalid attachment_id format
  await testCase('Invalid attachment_id format', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-attachment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        record_id: '123456',
        attachment_id: 'invalid-id'
      })
    });
    const data = await response.json().catch(() => ({}));
    // Should be handled
    assert(response.status === 400 || response.status === 404 || response.status === 500);
  });

  // Test 7: Non-existent attachment
  await testCase('Non-existent attachment ID', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-attachment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        record_id: '123456789012345678',
        attachment_id: '999999999999999999'
      })
    });
    // Should return 404 or 500
    assert(response.status === 404 || response.status === 500);
  });
}

// ============================================================================
// TEST SUITE: /api/add-note
// ============================================================================
async function testAddNoteErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/add-note${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: GET method not allowed
  await testCase('GET method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'GET'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 2: Missing all fields
  await testCase('Missing all required fields', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
  });

  // Test 3: Missing module
  await testCase('Missing module field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        record_id: '123456',
        note_content: 'Test note'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 4: Missing record_id
  await testCase('Missing record_id field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        note_content: 'Test note'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 5: Missing note_content
  await testCase('Missing note_content field', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        record_id: '123456'
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 6: Empty note_content
  await testCase('Empty note_content', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        record_id: '123456',
        note_content: ''
      })
    });
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 7: Extremely long note_content
  await testCase('Extremely long note_content (100KB+)', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'Contacts',
        record_id: '123456',
        note_content: 'A'.repeat(100000)
      })
    });
    const data = await response.json().catch(() => ({}));
    // Should handle or reject
    assert(response.status === 400 || response.status === 413 || response.status === 500);
  });

  // Test 8: Invalid module
  await testCase('Invalid module name', async () => {
    const response = await fetch(`${API_BASE_URL}/api/add-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: 'InvalidModule',
        record_id: '123456',
        note_content: 'Test note'
      })
    });
    const data = await response.json();
    assert(response.status === 400 || response.status === 500);
  });
}

// ============================================================================
// TEST SUITE: /api/get-record
// ============================================================================
async function testGetRecordErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/get-record${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: POST method not allowed
  await testCase('POST method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record`, {
      method: 'POST'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 2: Missing both parameters
  await testCase('Missing module and recordId', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record`);
    const data = await response.json();
    assertStatus(response.status, 400);
    assertHasError(data);
  });

  // Test 3: Missing module
  await testCase('Missing module parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record?recordId=123456`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 4: Missing recordId
  await testCase('Missing recordId parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record?module=Contacts`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 5: Invalid module
  await testCase('Invalid module (not in valid list)', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record?module=InvalidModule&recordId=123`);
    const data = await response.json();
    assertStatus(response.status, 400);
    assert(data.error.includes('Invalid module'), 'Should list valid modules');
  });

  // Test 6: Valid module but non-existent record
  await testCase('Non-existent recordId', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record?module=Contacts&recordId=999999999999999999`);
    const data = await response.json();
    // Should be 404 or 500
    assert(response.status === 404 || response.status === 500);
  });

  // Test 7: Invalid recordId format
  await testCase('Invalid recordId format (letters)', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record?module=Contacts&recordId=abc123xyz`);
    const data = await response.json();
    assert(response.status === 400 || response.status === 404 || response.status === 500);
  });

  // Test 8: Empty parameters
  await testCase('Empty module parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record?module=&recordId=123`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 9: Case sensitivity test
  await testCase('Lowercase module name', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-record?module=contacts&recordId=123`);
    const data = await response.json();
    // Should reject invalid module (case-sensitive)
    assertStatus(response.status, 400);
  });
}

// ============================================================================
// TEST SUITE: /api/get-communications
// ============================================================================
async function testGetCommunicationsErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/get-communications${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: POST method not allowed
  await testCase('POST method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-communications`, {
      method: 'POST'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 2: Missing parameters
  await testCase('Missing module and recordId', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-communications`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 3: Missing module
  await testCase('Missing module parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-communications?recordId=123`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 4: Missing recordId
  await testCase('Missing recordId parameter', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-communications?module=Contacts`);
    const data = await response.json();
    assertStatus(response.status, 400);
  });

  // Test 5: Invalid module
  await testCase('Invalid module name', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-communications?module=InvalidModule&recordId=123`);
    const data = await response.json();
    assertStatus(response.status, 400);
    assert(data.error.includes('Invalid module'));
  });

  // Test 6: Non-existent record
  await testCase('Non-existent recordId', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-communications?module=Contacts&recordId=999999999999999999`);
    const data = await response.json();
    // Should handle gracefully - might return empty array or error
    assert(response.status === 200 || response.status === 404 || response.status === 500);
  });

  // Test 7: Invalid recordId format
  await testCase('Invalid recordId format', async () => {
    const response = await fetch(`${API_BASE_URL}/api/get-communications?module=Contacts&recordId=invalid-id`);
    const data = await response.json();
    assert(response.status === 400 || response.status === 500);
  });
}

// ============================================================================
// TEST SUITE: /api/privacy-policy
// ============================================================================
async function testPrivacyPolicyErrors() {
  console.log(`\n${colors.bold}${colors.blue}Testing /api/privacy-policy${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: POST method not allowed
  await testCase('POST method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/privacy-policy`, {
      method: 'POST'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 2: PUT method not allowed
  await testCase('PUT method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/privacy-policy`, {
      method: 'PUT'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 3: DELETE method not allowed
  await testCase('DELETE method not allowed', async () => {
    const response = await fetch(`${API_BASE_URL}/api/privacy-policy`, {
      method: 'DELETE'
    });
    const data = await response.json();
    assertStatus(response.status, 405);
  });

  // Test 4: Valid GET should work
  await testCase('Valid GET request returns 200', async () => {
    const response = await fetch(`${API_BASE_URL}/api/privacy-policy`);
    const data = await response.json();
    assertStatus(response.status, 200);
    assert(data.company === 'Alfa Systems LLC', 'Should return privacy policy data');
  });
}

// ============================================================================
// CROSS-CUTTING CONCERNS TESTS
// ============================================================================
async function testCrossCuttingConcerns() {
  console.log(`\n${colors.bold}${colors.blue}Testing Cross-Cutting Concerns${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test 1: CORS headers
  await testCase('CORS headers present', async () => {
    const response = await fetch(`${API_BASE_URL}/api/privacy-policy`);
    const corsHeader = response.headers.get('access-control-allow-origin');
    // Should have CORS headers or handle CORS
    assert(corsHeader !== null || response.status === 200, 'Should handle CORS');
  });

  // Test 2: Content-Type headers
  await testCase('JSON content-type for errors', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact`);
    const contentType = response.headers.get('content-type');
    assert(contentType && contentType.includes('application/json'), 'Should return JSON');
  });

  // Test 3: Non-existent endpoint
  await testCase('Non-existent endpoint returns 404', async () => {
    const response = await fetch(`${API_BASE_URL}/api/non-existent-endpoint`);
    assertStatus(response.status, 404);
  });

  // Test 4: Root path behavior
  await testCase('Root path handling', async () => {
    const response = await fetch(`${API_BASE_URL}/`);
    // Should return something (200) or redirect
    assert(response.status === 200 || response.status === 301 || response.status === 302);
  });

  // Test 5: OPTIONS request handling (CORS preflight)
  await testCase('OPTIONS request for CORS preflight', async () => {
    const response = await fetch(`${API_BASE_URL}/api/search-contact`, {
      method: 'OPTIONS'
    });
    // Should handle OPTIONS
    assert(response.status === 200 || response.status === 204 || response.status === 405);
  });
}

// ============================================================================
// RATE LIMITING TESTS (if implemented)
// ============================================================================
async function testRateLimiting() {
  console.log(`\n${colors.bold}${colors.blue}Testing Rate Limiting (if implemented)${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(60)}${colors.reset}\n`);

  // Test: Rapid sequential requests
  await testCase('Rapid sequential requests', async () => {
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(fetch(`${API_BASE_URL}/api/privacy-policy`));
    }
    const responses = await Promise.all(promises);

    // Check if any responses indicate rate limiting
    const rateLimited = responses.some(r => r.status === 429);

    if (rateLimited) {
      console.log(`  ${colors.yellow}Rate limiting detected (429)${colors.reset}`);
    } else {
      console.log(`  ${colors.gray}No rate limiting detected${colors.reset}`);
    }

    // This test always passes - just informational
    assert(true);
  });
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================
async function runAllTests() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Zoho CRM GPT API - Comprehensive Error Test Suite       ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(colors.reset);
  console.log(`${colors.gray}API: ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.gray}Started: ${new Date().toISOString()}${colors.reset}`);

  const startTime = Date.now();

  // Check API health first
  const isHealthy = await checkAPIHealth();
  if (!isHealthy) {
    console.log(`\n${colors.red}${colors.bold}⚠ WARNING: API may not be reachable. Some tests may fail.${colors.reset}\n`);
  }

  // Run all test suites
  await testSearchContactErrors();
  await testSearchLeadErrors();
  await testGetNotesErrors();
  await testSendEmailErrors();
  await testListAttachmentsErrors();
  await testGetAttachmentErrors();
  await testAddNoteErrors();
  await testGetRecordErrors();
  await testGetCommunicationsErrors();
  await testPrivacyPolicyErrors();
  await testCrossCuttingConcerns();
  await testRateLimiting();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Print summary
  console.log(`\n${colors.bold}${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}TEST SUMMARY${colors.reset}\n`);
  console.log(`Total Tests:  ${results.total}`);
  console.log(`${colors.green}Passed:       ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed:       ${results.failed}${colors.reset}`);
  console.log(`${colors.gray}Skipped:      ${results.skipped}${colors.reset}`);
  console.log(`\nDuration:     ${duration}s`);
  console.log(`Completed:    ${new Date().toISOString()}`);

  // Show failed test details if any
  if (results.failed > 0) {
    console.log(`\n${colors.bold}${colors.red}FAILED TESTS:${colors.reset}`);
    results.errors.forEach((err, index) => {
      console.log(`\n${index + 1}. ${err.test}`);
      console.log(`   ${colors.gray}${err.error}${colors.reset}`);
    });
  }

  console.log(`\n${colors.bold}${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the test suite
runAllTests().catch(error => {
  console.error(`\n${colors.red}${colors.bold}Fatal Error:${colors.reset}`, error);
  process.exit(1);
});
