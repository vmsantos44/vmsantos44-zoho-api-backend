const WorkDriveAPI = require('../../api/workdrive');
const { formatWorkDriveItem } = require('../../lib/workdrive-utils');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { parentId, limit = 50, nextToken } = req.query;

  try {
    const workdrive = new WorkDriveAPI();
    const response = await workdrive.listFolder({
      parentId,
      limit,
      nextToken
    });

    const files = Array.isArray(response?.data)
      ? response.data.map(formatWorkDriveItem).filter(Boolean)
      : [];

    return res.status(200).json({
      success: true,
      count: files.length,
      folder_id: parentId || process.env.ZOHO_WORKDRIVE_DEFAULT_PARENT_ID || null,
      next_token: response?.page_info?.next_token || null,
      data: files
    });
  } catch (error) {
    console.error('Error listing WorkDrive folder:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to list WorkDrive folder',
      details: error.response?.data || error.message
    });
  }
}
