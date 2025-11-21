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

    // Fetch attachment content from Zoho CRM v2
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/${module}/${record_id}/Attachments/${attachment_id}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        },
        responseType: 'arraybuffer'
      }
    );

    // Get file info from headers
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const contentDisposition = response.headers['content-disposition'] || '';
    const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const fileName = fileNameMatch ? fileNameMatch[1].replace(/['"]/g, '') : `attachment_${attachment_id}`;

    // Convert to base64 for GPT compatibility
    const base64Data = Buffer.from(response.data).toString('base64');

    return res.status(200).json({
      success: true,
      file_name: fileName,
      content_type: contentType,
      size_bytes: response.data.byteLength,
      data_base64: base64Data
    });

  } catch (error) {
    // Decode arraybuffer error if present
    let errorDetails = error.message;
    if (error.response?.data) {
      try {
        const decoded = Buffer.from(error.response.data).toString('utf8');
        errorDetails = JSON.parse(decoded);
      } catch {
        errorDetails = error.response.data;
      }
    }
    console.error('Error fetching attachment:', errorDetails);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch attachment',
      details: errorDetails,
      status: error.response?.status
    });
  }
}
