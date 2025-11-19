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
    // Get OAuth token
    const tokenResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/oauth-token`);
    const { access_token } = await tokenResponse.json();

    // Create note in Zoho CRM
    const notesUrl = `https://www.zohoapis.com/crm/v2/${module}/${record_id}/Notes`;

    const noteData = {
      data: [
        {
          Note_Title: note_title || 'Note from CRM Assistant',
          Note_Content: note_content,
          se_module: module
        }
      ]
    };

    const response = await fetch(notesUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(noteData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    if (data.data && data.data[0] && data.data[0].code === 'SUCCESS') {
      return res.status(200).json({
        success: true,
        message: 'Note added successfully',
        note_id: data.data[0].details.id,
        data: data.data[0]
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Failed to create note',
        details: data
      });
    }

  } catch (error) {
    console.error('Error adding note:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add note',
      details: error.message
    });
  }
}
