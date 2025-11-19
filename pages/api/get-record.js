const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { module, recordId } = req.query;

  if (!module || !recordId) {
    return res.status(400).json({
      error: 'Missing required parameters: module, recordId'
    });
  }

  // Validate module
  const validModules = ['Contacts', 'Leads', 'Deals', 'Accounts'];
  if (!validModules.includes(module)) {
    return res.status(400).json({
      error: `Invalid module. Must be one of: ${validModules.join(', ')}`
    });
  }

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

    // Fetch record from Zoho CRM
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/${module}/${recordId}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    // Zoho returns data in a "data" array with one record
    if (response.data.data && response.data.data.length > 0) {
      return res.status(200).json({
        success: true,
        data: response.data.data[0]
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

  } catch (error) {
    console.error('Error fetching record:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch record',
      details: error.response?.data || error.message
    });
  }
}
