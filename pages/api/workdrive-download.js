const WorkDriveAPI = require('../../api/workdrive');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileId, inline = 'false' } = req.query;

  if (!fileId) {
    return res.status(400).json({ error: 'fileId parameter is required' });
  }

  try {
    const workdrive = new WorkDriveAPI();
    const response = await workdrive.downloadFile(fileId);
    const dispositionType = inline === 'true' ? 'inline' : 'attachment';
    const rawDisposition = response.headers['content-disposition'];
    const fileNamePart = rawDisposition
      ? rawDisposition.split(';').find(part => part.trim().startsWith('filename'))
      : null;
    const fileName = fileNamePart ? fileNamePart.trim() : `filename="workdrive_${fileId}"`;

    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `${dispositionType}; ${fileName}`);
    return res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Error downloading WorkDrive file:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to download WorkDrive file',
      details: error.response?.data || error.message
    });
  }
}
