# Rate Limiting Implementation Guide

## Priority: HIGH 🔴

Based on the comprehensive API error testing, implementing rate limiting is the **#1 priority** to secure your Zoho CRM GPT API before heavy production use.

---

## Why Rate Limiting is Critical

### Current Vulnerability
Your API currently processes **unlimited requests** without throttling. The test suite confirmed:
- 10+ rapid requests/second all processed successfully
- No 429 (Too Many Requests) responses
- No rate limiting headers present

### Risks Without Rate Limiting

1. **Denial of Service (DoS) Attacks**
   - Attackers can overwhelm your API with requests
   - Service becomes unavailable for legitimate users

2. **Cost Overruns**
   - Each API request triggers Zoho CRM API calls
   - Zoho charges per API call ($0.0X per request)
   - Unlimited requests = unlimited costs

3. **Resource Exhaustion**
   - Vercel function invocations have limits
   - Excessive requests can exhaust your Vercel quota
   - May impact other services on same account

4. **Brute Force Attacks**
   - Attackers can attempt many authentication guesses
   - Can search for valid candidate IDs
   - Can probe for system vulnerabilities

---

## Recommended Rate Limits

Based on your API usage patterns and Zoho's rate limits:

| Endpoint Type | Limit | Window | Rationale |
|---------------|-------|--------|-----------|
| **Read Operations** (search, get) | 100 req/min | Per IP | Normal user browsing |
| **Write Operations** (send-email, add-note) | 20 req/min | Per IP | Prevent spam/abuse |
| **Attachment Operations** | 50 req/min | Per IP | File operations are expensive |
| **Privacy Policy** | 200 req/min | Per IP | Static content, can be higher |

---

## Implementation Options

### Option 1: Vercel Edge Middleware (Recommended) ⭐

**Pros:**
- Native Vercel integration
- Runs at edge (faster)
- No external dependencies
- Free tier available

**Cons:**
- Requires Vercel Edge Functions
- Limited customization

**Implementation:**

1. **Install Vercel Rate Limit Package**

```bash
npm install @vercel/edge-config
```

2. **Create Middleware File**

Create `/Users/santos/Downloads/zoho-crm-gpt/middleware.js`:

```javascript
import { ratelimit } from '@vercel/edge';

// Define rate limiters for different endpoint types
const limiters = {
  read: ratelimit({
    interval: '1m',
    limit: 100,
  }),
  write: ratelimit({
    interval: '1m',
    limit: 20,
  }),
  attachment: ratelimit({
    interval: '1m',
    limit: 50,
  }),
  static: ratelimit({
    interval: '1m',
    limit: 200,
  }),
};

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'anonymous';

  // Determine which limiter to use
  let limiter;
  if (pathname.includes('send-email') || pathname.includes('add-note')) {
    limiter = limiters.write;
  } else if (pathname.includes('attachment')) {
    limiter = limiters.attachment;
  } else if (pathname.includes('privacy-policy')) {
    limiter = limiters.static;
  } else {
    limiter = limiters.read;
  }

  // Check rate limit
  const { success, limit, remaining, reset } = await limiter.check(ip);

  // Create response with rate limit headers
  const response = success
    ? NextResponse.next()
    : new Response('Rate limit exceeded. Please try again later.', {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
        },
      });

  // Add rate limit headers to all responses
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}

// Configure which routes to apply middleware to
export const config = {
  matcher: '/api/:path*',
};
```

3. **Update package.json**

Add to your `package.json`:

```json
{
  "dependencies": {
    "@vercel/edge-config": "^1.0.0"
  }
}
```

4. **Deploy**

```bash
npm install
vercel deploy
```

---

### Option 2: Upstash Redis (Most Flexible) ⭐⭐

**Pros:**
- Fine-grained control
- Distributed rate limiting
- Scales better for multiple instances
- Free tier: 10,000 requests/day

**Cons:**
- Requires external service (Upstash)
- Additional setup

**Implementation:**

1. **Sign up for Upstash**
   - Go to https://upstash.com
   - Create free account
   - Create Redis database
   - Get credentials (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)

2. **Install Dependencies**

```bash
npm install @upstash/ratelimit @upstash/redis
```

3. **Add Environment Variables to Vercel**

Go to Vercel Dashboard → Settings → Environment Variables:

```
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

4. **Create Rate Limit Utility**

Create `/Users/santos/Downloads/zoho-crm-gpt/lib/ratelimit.js`:

```javascript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = Redis.fromEnv();

// Create rate limiters
export const rateLimiters = {
  read: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'zoho-crm-read',
  }),

  write: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'zoho-crm-write',
  }),

  attachment: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, '1 m'),
    analytics: true,
    prefix: 'zoho-crm-attachment',
  }),

  static: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, '1 m'),
    analytics: true,
    prefix: 'zoho-crm-static',
  }),
};

// Helper function to check rate limit
export async function checkRateLimit(type, identifier) {
  const limiter = rateLimiters[type] || rateLimiters.read;
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  };
}
```

5. **Update API Endpoints**

Example for `/pages/api/search-contact.js`:

```javascript
import { checkRateLimit } from '../../lib/ratelimit';

export default async function handler(req, res) {
  // Get identifier (IP address)
  const identifier = req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     'anonymous';

  // Check rate limit
  const rateLimit = await checkRateLimit('read', identifier);

  // Add headers to response
  Object.entries(rateLimit.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // If rate limit exceeded, return 429
  if (!rateLimit.success) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      limit: rateLimit.limit,
      remaining: 0,
      resetAt: new Date(rateLimit.reset).toISOString(),
    });
  }

  // Continue with normal request handling...
  // ... rest of your existing code
}
```

6. **Deploy**

```bash
npm install
vercel deploy
```

---

### Option 3: Simple In-Memory Rate Limiting (Quick Start)

**Pros:**
- No external dependencies
- Fast to implement
- Free

**Cons:**
- Resets when function restarts
- Doesn't work across multiple instances
- Not production-ready for scale

**Use for:** Development/testing only

**Implementation:**

Create `/Users/santos/Downloads/zoho-crm-gpt/lib/simple-ratelimit.js`:

```javascript
const rateData = new Map();

export function simpleRateLimit(identifier, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const data = rateData.get(identifier) || { count: 0, resetTime: now + windowMs };

  // Reset if window has passed
  if (now > data.resetTime) {
    data.count = 0;
    data.resetTime = now + windowMs;
  }

  // Increment count
  data.count++;
  rateData.set(identifier, data);

  // Check if limit exceeded
  const success = data.count <= limit;
  const remaining = Math.max(0, limit - data.count);

  return {
    success,
    limit,
    remaining,
    reset: data.resetTime,
  };
}
```

Usage in endpoints:

```javascript
import { simpleRateLimit } from '../../lib/simple-ratelimit';

export default async function handler(req, res) {
  const identifier = req.headers['x-forwarded-for'] || 'anonymous';
  const rateLimit = simpleRateLimit(identifier, 100, 60000); // 100 req/min

  if (!rateLimit.success) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      remaining: rateLimit.remaining,
      resetAt: new Date(rateLimit.reset).toISOString(),
    });
  }

  // Continue with request...
}
```

---

## Step-by-Step Implementation (Recommended: Option 2 - Upstash)

### Phase 1: Setup (15 minutes)

1. **Create Upstash Account**
   ```bash
   # Go to https://upstash.com
   # Sign up with GitHub/Google
   # Create new Redis database (choose closest region)
   ```

2. **Get Credentials**
   ```bash
   # Copy these from Upstash dashboard:
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

3. **Add to Vercel**
   ```bash
   # Vercel Dashboard → Your Project → Settings → Environment Variables
   # Add both variables above
   ```

### Phase 2: Install Dependencies (5 minutes)

```bash
cd /Users/santos/Downloads/zoho-crm-gpt
npm install @upstash/ratelimit @upstash/redis
```

### Phase 3: Create Rate Limit Utility (10 minutes)

Copy the `lib/ratelimit.js` code from Option 2 above.

### Phase 4: Update One Endpoint (10 minutes)

Start with `/pages/api/search-contact.js` as a test:

```javascript
import { checkRateLimit } from '../../lib/ratelimit';

export default async function handler(req, res) {
  // 1. Get identifier
  const identifier = req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     'anonymous';

  // 2. Check rate limit
  const rateLimit = await checkRateLimit('read', identifier);

  // 3. Add headers
  Object.entries(rateLimit.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // 4. Block if exceeded
  if (!rateLimit.success) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests from this IP. Please try again later.',
      limit: rateLimit.limit,
      remaining: 0,
      resetAt: new Date(rateLimit.reset).toISOString(),
    });
  }

  // 5. Continue with original code...
  // ... your existing handler code
}
```

### Phase 5: Test (5 minutes)

```bash
# Deploy to Vercel
vercel deploy

# Test rate limiting
cd tests
node -e "
const fetch = require('node-fetch');
(async () => {
  for (let i = 0; i < 120; i++) {
    const res = await fetch('https://your-api.vercel.app/api/search-contact?searchTerm=test');
    console.log(\`Request \${i+1}: \${res.status}\`);
    if (res.status === 429) {
      console.log('✅ Rate limiting working!');
      break;
    }
  }
})();
"
```

### Phase 6: Roll Out to All Endpoints (30 minutes)

Update all endpoint files:
- `/pages/api/search-lead.js`
- `/pages/api/get-notes.js`
- `/pages/api/send-email.js` (use 'write' type)
- `/pages/api/list-attachments.js` (use 'attachment' type)
- `/pages/api/get-attachment.js` (use 'attachment' type)
- `/pages/api/add-note.js` (use 'write' type)
- `/pages/api/get-record.js`
- `/pages/api/get-communications.js`

### Phase 7: Deploy & Monitor (10 minutes)

```bash
# Final deployment
vercel deploy --prod

# Monitor Upstash dashboard for:
# - Request counts
# - Rate limit hits
# - Performance metrics
```

---

## Testing Rate Limiting

### Manual Test

```bash
# Rapid fire 120 requests (should hit limit at 100)
for i in {1..120}; do
  curl -w "%{http_code}\n" -o /dev/null -s \
    "https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/search-contact?searchTerm=test"
done
```

**Expected:**
- First 100 requests: `200`
- Requests 101-120: `429`

### Automated Test

Add to your test suite (`tests/rate-limit-test.js`):

```javascript
async function testRateLimiting() {
  console.log('🧪 Testing Rate Limiting...\n');

  let successCount = 0;
  let rateLimitCount = 0;

  for (let i = 0; i < 120; i++) {
    const response = await fetch(
      'https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app/api/search-contact?searchTerm=test'
    );

    if (response.status === 200) successCount++;
    if (response.status === 429) rateLimitCount++;

    // Check headers
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');

    if (i % 20 === 0) {
      console.log(`Request ${i+1}: ${response.status} (Remaining: ${remaining}/${limit})`);
    }
  }

  console.log(`\n✅ Success (200): ${successCount}`);
  console.log(`⚠️  Rate Limited (429): ${rateLimitCount}`);
  console.log(`\n${rateLimitCount > 0 ? '✅ PASS' : '❌ FAIL'}: Rate limiting is ${rateLimitCount > 0 ? 'working' : 'NOT working'}`);
}

testRateLimiting();
```

---

## Monitoring & Alerts

### Upstash Dashboard

Monitor these metrics:
- **Request count** - Total API requests
- **Rate limit hits** - How often users hit limits
- **Top IPs** - Identify potential abusers

### Vercel Analytics

Enable Vercel Analytics to track:
- **429 responses** - Rate limit rejections
- **Response times** - Performance impact
- **Error rates** - Overall API health

### Custom Alerts

Set up alerts for:
- High rate limit hit rate (>10% of requests)
- Specific IPs hitting limits repeatedly
- Sudden traffic spikes

---

## Cost Estimates

### Upstash Free Tier
- 10,000 commands/day
- Good for ~300-500 API requests/hour
- **Cost:** FREE

### Upstash Paid Tier
- Starts at $10/month
- 1M commands/month
- Good for ~30,000 API requests/hour
- **Cost:** $10-50/month depending on usage

### Vercel Edge Config
- Included in Pro plan ($20/month)
- **Cost:** $20/month (if not already on Pro)

---

## Rollback Plan

If rate limiting causes issues:

1. **Temporary Disable**
   ```javascript
   // In middleware.js or individual endpoints
   // Comment out rate limit check:
   // if (!rateLimit.success) { ... }
   ```

2. **Increase Limits**
   ```javascript
   // In lib/ratelimit.js
   read: new Ratelimit({
     limiter: Ratelimit.slidingWindow(200, '1 m'), // Doubled
   })
   ```

3. **Whitelist IPs**
   ```javascript
   const WHITELIST = ['your-office-ip', 'trusted-ip'];
   if (WHITELIST.includes(identifier)) {
     return NextResponse.next(); // Skip rate limiting
   }
   ```

---

## Next Steps

1. ✅ **Read this guide**
2. ⬜ **Choose implementation** (Recommended: Option 2 - Upstash)
3. ⬜ **Phase 1-3**: Setup Upstash and install dependencies (30 min)
4. ⬜ **Phase 4**: Update one endpoint and test (20 min)
5. ⬜ **Phase 5-6**: Roll out to all endpoints (40 min)
6. ⬜ **Phase 7**: Deploy and monitor (10 min)
7. ⬜ **Update test suite** to verify rate limiting
8. ⬜ **Monitor for 1 week** and adjust limits as needed

---

## Questions?

**Q: Will rate limiting slow down my API?**
A: No, minimal overhead (~5-10ms per request with Upstash)

**Q: What happens to legitimate users who hit the limit?**
A: They see a clear error message and can retry after 1 minute

**Q: Can I have different limits for different users?**
A: Yes, use user ID or API key instead of IP as identifier

**Q: What if I'm using a shared IP (office, VPN)?**
A: Consider using API keys for authenticated users or increase limits

---

**Status:** 📋 Implementation Pending
**Priority:** 🔴 HIGH
**Estimated Time:** 90 minutes
**Recommended Option:** Option 2 (Upstash Redis)
