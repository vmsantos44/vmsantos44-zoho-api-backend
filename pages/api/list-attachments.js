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
    // Get OAuth token - construct full URL with protocol
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const tokenResponse = await fetch(`${baseUrl}/api/oauth-token`);
    const { access_token } = await tokenResponse.json();

    // Fetch attachments list from Zoho CRM
    const attachmentsUrl = `https://www.zohoapis.com/crm/v2/${module}/${record_id}/Attachments`;

    const response = await fetch(attachmentsUrl, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${access_token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Format attachment data for easy viewing
    if (data.data && data.data.length > 0) {
      const attachments = data.data.map(att => ({
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
    console.error('Error listing attachments:', error);
    return res.status(500).json({
      error: 'Failed to list attachments',
      details: error.message
    });
  }
}
