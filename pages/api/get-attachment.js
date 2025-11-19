const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { module, record_id, attachment_id } = req.body;

  if (!module || !record_id || !attachment_id) {
    return res.status(400).json({
      error: 'Missing required fields: module, record_id, attachment_id'
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

    // Fetch attachment from Zoho CRM
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/${module}/${record_id}/Attachments/${attachment_id}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        responseType: 'arraybuffer'
      }
    );

    // Get the file content
    const contentType = response.headers['content-type'];

    // Return the file
    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="attachment_${attachment_id}"`);
    return res.send(Buffer.from(response.data));

  } catch (error) {
    console.error('Error fetching attachment:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch attachment',
      details: error.response?.data || error.message
    });
  }
}
