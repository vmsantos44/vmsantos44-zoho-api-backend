const axios = require('axios');

// In-memory cache
let cache = {
  data: null,
  timestamp: null,
  resourceId: null
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

async function fetchSheetFromZoho(resourceId, accessToken) {
  // Use POST with method in body as required by Zoho Sheet API
  const url = `https://sheet.zoho.com/api/v2/${resourceId}`;

  const postData = new URLSearchParams();
  postData.append('method', 'workbook.data.get');

  const response = await axios.post(url, postData.toString(), {
    headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data;
}

async function getAccessToken() {
  const tokenResponse = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
    null,
    {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      }
    }
  );
  return tokenResponse.data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resourceId, refresh } = req.query;

  if (!resourceId) {
    return res.status(400).json({
      error: 'Missing required parameter: resourceId (the Zoho Sheet ID)'
    });
  }

  try {
    const now = Date.now();
    const cacheValid = cache.data &&
                       cache.resourceId === resourceId &&
                       cache.timestamp &&
                       (now - cache.timestamp) < CACHE_TTL;

    // Return cached data if valid and not forcing refresh
    if (cacheValid && refresh !== 'true') {
      return res.status(200).json({
        success: true,
        data: cache.data,
        resourceId: resourceId,
        cached: true,
        cacheAge: Math.round((now - cache.timestamp) / 1000) + 's'
      });
    }

    // Fetch fresh data
    const accessToken = await getAccessToken();
    const data = await fetchSheetFromZoho(resourceId, accessToken);

    // Update cache
    cache = {
      data: data,
      timestamp: now,
      resourceId: resourceId
    };

    return res.status(200).json({
      success: true,
      data: data,
      resourceId: resourceId,
      cached: false
    });

  } catch (error) {
    console.error('Error fetching sheet data:', error.response?.data || error.message);

    // If fetch fails but we have cached data, return it
    if (cache.data && cache.resourceId === resourceId) {
      return res.status(200).json({
        success: true,
        data: cache.data,
        resourceId: resourceId,
        cached: true,
        stale: true,
        error: 'Using stale cache due to fetch error'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch sheet data',
      details: error.response?.data || error.message
    });
  }
}
