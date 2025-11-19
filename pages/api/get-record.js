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
    // Get OAuth token
    const tokenResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/oauth-token`);
    const { access_token } = await tokenResponse.json();

    // Fetch record from Zoho CRM
    const recordUrl = `https://www.zohoapis.com/crm/v2/${module}/${recordId}`;

    const response = await fetch(recordUrl, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Zoho returns data in a "data" array with one record
    if (data.data && data.data.length > 0) {
      return res.status(200).json({
        success: true,
        data: data.data[0]
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

  } catch (error) {
    console.error('Error fetching record:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch record',
      details: error.message
    });
  }
}
