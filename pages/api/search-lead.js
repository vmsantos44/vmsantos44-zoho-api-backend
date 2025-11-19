const ZohoAPI = require('../../api/zoho');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { searchTerm, limit = 10 } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: 'searchTerm parameter is required' });
  }

  try {
    const zoho = new ZohoAPI();
    const results = await zoho.searchLeads(searchTerm);

    // Limit results to prevent context overflow
    const maxResults = parseInt(limit) || 10;
    const limitedResults = Array.isArray(results)
      ? results.slice(0, maxResults)
      : results;

    const totalCount = Array.isArray(results) ? results.length : 0;
    const hasMore = totalCount > maxResults;

    return res.status(200).json({
      success: true,
      data: limitedResults,
      count: limitedResults.length || 0,
      total: totalCount,
      has_more: hasMore,
      message: hasMore ? `Showing ${maxResults} of ${totalCount} results. Refine your search for more specific results.` : null
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
