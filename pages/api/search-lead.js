const ZohoAPI = require('../../api/zoho');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: 'searchTerm parameter is required' });
  }

  try {
    const zoho = new ZohoAPI();
    const results = await zoho.searchLeads(searchTerm);
    
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
