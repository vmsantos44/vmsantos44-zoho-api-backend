const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tag, modules = ['Leads', 'Contacts', 'Tasks'] } = req.body;

  if (!tag) {
    return res.status(400).json({
      error: 'Missing required field: tag'
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
    const results = {};

    // Search each module for records with the specified tag
    for (const module of modules) {
      try {
        const response = await axios.get(
          `https://www.zohoapis.com/crm/v2/${module}/search`,
          {
            headers: {
              'Authorization': `Zoho-oauthtoken ${accessToken}`
            },
            params: {
              criteria: `(Tag:equals:${tag})`
            }
          }
        );

        results[module] = {
          success: true,
          count: response.data.data?.length || 0,
          records: response.data.data || []
        };
      } catch (error) {
        // If no records found, Zoho returns 400
        if (error.response?.status === 400) {
          results[module] = {
            success: true,
            count: 0,
            records: []
          };
        } else {
          results[module] = {
            success: false,
            error: error.response?.data?.message || error.message
          };
        }
      }
    }

    // Calculate total across all modules
    const totalCount = Object.values(results).reduce((sum, r) => sum + (r.count || 0), 0);

    return res.status(200).json({
      success: true,
      tag: tag,
      total_count: totalCount,
      results: results
    });

  } catch (error) {
    console.error('Error searching by tag:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to search by tag',
      details: error.response?.data || error.message
    });
  }
}
