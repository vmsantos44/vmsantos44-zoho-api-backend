const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { module, record_id } = req.body;

  if (!module || !record_id) {
    return res.status(400).json({
      error: 'Missing required fields: module, record_id'
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

    // Fetch attachments list from Zoho CRM
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/${module}/${record_id}/Attachments`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    // Format attachment data for easy viewing
    if (response.data.data && response.data.data.length > 0) {
      const attachments = response.data.data.map(att => ({
        id: att.id,
        file_name: att.File_Name,
        size: att.Size,
        type: att.$file_type,
        created_time: att.Created_Time,
        created_by: att.Created_By?.name,
        download_url: `https://vmsantos44-zoho-api-backend.vercel.app/api/get-attachment?module=${module}&record_id=${record_id}&attachment_id=${att.id}`
      }));

      return res.status(200).json({
        success: true,
        count: attachments.length,
        attachments: attachments
      });
    } else {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'No attachments found for this record',
        attachments: []
      });
    }

  } catch (error) {
    console.error('Error listing attachments:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to list attachments',
      details: error.response?.data || error.message
    });
  }
}
