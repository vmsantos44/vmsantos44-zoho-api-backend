const ZohoAPI = require('../../api/zoho');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toAddress, subject, body, fromAddress } = req.body;

  if (!toAddress || !subject || !body) {
    return res.status(400).json({ error: 'toAddress, subject, and body are required' });
  }

  try {
    const zoho = new ZohoAPI();
    const results = await zoho.sendEmail(toAddress, subject, body, fromAddress);
    
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
