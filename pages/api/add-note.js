const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { module, record_id, note_title, note_content } = req.body;

  if (!module || !record_id || !note_content) {
    return res.status(400).json({
      error: 'Missing required fields: module, record_id, note_content'
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

    // Create note in Zoho CRM
    const noteData = {
      data: [
        {
          Note_Title: note_title || 'Note from CRM Assistant',
          Note_Content: note_content,
          se_module: module
        }
      ]
    };

    const response = await axios.post(
      `https://www.zohoapis.com/crm/v2/${module}/${record_id}/Notes`,
      noteData,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.data && response.data.data[0] && response.data.data[0].code === 'SUCCESS') {
      return res.status(200).json({
        success: true,
        message: 'Note added successfully',
        note_id: response.data.data[0].details.id,
        data: response.data.data[0]
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to create note',
        details: response.data
      });
    }

  } catch (error) {
    console.error('Error adding note:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to add note',
      details: error.response?.data || error.message
    });
  }
}
