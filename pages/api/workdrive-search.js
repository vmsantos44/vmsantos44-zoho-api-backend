const WorkDriveAPI = require('../../api/workdrive');
const { formatWorkDriveItem } = require('../../lib/workdrive-utils');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, parentId, limit = 20, offset = 0, includeFolders = 'true' } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'query parameter is required' });
  }

  try {
    const workdrive = new WorkDriveAPI();
    const includeFoldersFlag = includeFolders !== 'false';

    const results = await workdrive.searchFiles({
      query,
      parentId,
      includeFolders: includeFoldersFlag,
      limit,
      offset
    });

    const files = Array.isArray(results?.data)
      ? results.data.map(formatWorkDriveItem).filter(Boolean)
      : [];

    return res.status(200).json({
      success: true,
      count: files.length,
      total: results?.summary?.total_matches ?? files.length,
      next_token: results?.page_info?.next_token || null,
      data: files
    });
  } catch (error) {
    console.error('Error searching WorkDrive:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to search Zoho WorkDrive',
      details: error.response?.data || error.message
    });
  }
}
