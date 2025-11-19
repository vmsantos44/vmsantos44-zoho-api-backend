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
    // Get OAuth token
    const tokenResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/oauth-token`);
    const { access_token } = await tokenResponse.json();

    // Fetch attachment from Zoho CRM
    const attachmentUrl = `https://www.zohoapis.com/crm/v2/${module}/${record_id}/Attachments/${attachment_id}`;

    const response = await fetch(attachmentUrl, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${access_token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Zoho API error: ${response.status} ${response.statusText}`);
    }

    // Get the file content
    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    // Return the file
    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="attachment_${attachment_id}"`);
    return res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Error fetching attachment:', error);
    return res.status(500).json({
      error: 'Failed to fetch attachment',
      details: error.message
    });
  }
}
