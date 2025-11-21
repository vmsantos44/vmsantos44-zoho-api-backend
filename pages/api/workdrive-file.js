const WorkDriveAPI = require('../../api/workdrive');
const { formatWorkDriveItem } = require('../../lib/workdrive-utils');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).json({ error: 'fileId parameter is required' });
  }

  try {
    const workdrive = new WorkDriveAPI();
    const response = await workdrive.getFileDetails(fileId);
    const data = Array.isArray(response?.data) ? response.data[0] : response?.data;
    const item = formatWorkDriveItem(data);

    return res.status(200).json({
      success: true,
      data: item || data || null
    });
  } catch (error) {
    console.error('Error fetching WorkDrive file:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch WorkDrive file',
      details: error.response?.data || error.message
    });
  }
}
