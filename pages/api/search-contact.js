const ZohoAPI = require('../../api/zoho');
const cache = require('../../lib/cache');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { searchTerm, limit = 10, nocache } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: 'searchTerm parameter is required' });
  }

  try {
    const maxResults = parseInt(limit) || 10;
    const cacheKey = cache.generateKey('Contacts', searchTerm, maxResults);

    // Check cache first (unless nocache=true)
    if (!nocache) {
      const cached = cache.get(cacheKey);
      if (cached) {
        console.log(`Cache HIT: ${cacheKey}`);
        return res.status(200).json(cached);
      }
    }

    console.log(`Cache MISS: ${cacheKey} - fetching from API`);

    // Fetch from Zoho API
    const zoho = new ZohoAPI();
    const results = await zoho.searchContacts(searchTerm);

    // Limit results to prevent context overflow
    const limitedResults = Array.isArray(results)
      ? results.slice(0, maxResults)
      : results;

    const totalCount = Array.isArray(results) ? results.length : 0;
    const hasMore = totalCount > maxResults;

    const response = {
      success: true,
      data: limitedResults,
      count: limitedResults.length || 0,
      total: totalCount,
      has_more: hasMore,
      message: hasMore ? `Showing ${maxResults} of ${totalCount} results. Refine your search for more specific results.` : null
    };

    // Store in cache
    cache.set(cacheKey, response);

    return res.status(200).json(response);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
