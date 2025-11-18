const ZohoAPI = require('../../api/zoho');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { module, recordId } = req.query;

  if (!module || !recordId) {
    return res.status(400).json({ error: 'module and recordId parameters are required' });
  }

  try {
    const zoho = new ZohoAPI();
    const results = await zoho.getRecordNotes(module, recordId);
    
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
