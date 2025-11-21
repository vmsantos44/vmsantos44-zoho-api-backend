const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resourceId, range, worksheet } = req.query;

  if (!resourceId) {
    return res.status(400).json({
      error: 'Missing required parameter: resourceId (the Zoho Sheet ID)'
    });
  }

  // Default worksheet name if not provided
  const worksheetName = worksheet || 'Sheet1';

  try {
    // Get access token using refresh token
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

    const accessToken = tokenResponse.data.access_token;

    // Build the API URL with method parameter for Zoho Sheet API v2
    // The API requires specifying the method in the URL for data operations
    const baseUrl = `https://sheet.zoho.com/api/v2/${resourceId}`;

    // Build query parameters
    const params = new URLSearchParams();
    params.append('method', 'worksheet.records.fetch');
    params.append('worksheet_name', worksheetName);

    if (range) {
      params.append('range', range);
    }

    const url = `${baseUrl}?${params.toString()}`;

    // Fetch data from Zoho Sheet
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`
      }
    });

    return res.status(200).json({
      success: true,
      data: response.data,
      resourceId: resourceId,
      worksheet: worksheetName,
      range: range || 'all records'
    });

  } catch (error) {
    console.error('Error fetching sheet data:', error.response?.data || error.message);

    // More specific error messages
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: 'Sheet not found. Check that the resourceId is correct and you have access.',
        resourceId: resourceId
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Verify you have ZohoSheet.dataAPI.READ scope in your OAuth token.',
        resourceId: resourceId
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch sheet data',
      details: error.response?.data || error.message
    });
  }
}
