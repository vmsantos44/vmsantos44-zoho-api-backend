const { getPublicApiBaseUrl } = require('./public-base-url');

const PUBLIC_BASE_URL = getPublicApiBaseUrl();

/**
 * Normalize Zoho WorkDrive API responses into a GPT-friendly object.
 */
function formatWorkDriveItem(item) {
  if (!item) {
    return null;
  }

  const attributes = item.attributes || {};
  const contentInfo = attributes.content_info || {};
  const ownerInfo = attributes.owner_info || attributes.created_by || {};
  const recentActivity = attributes.recent_activity || {};
  const versionInfo = attributes.version_info || {};

  return {
    id: item.id,
    name: attributes.name || attributes.display_name || null,
    type: attributes.type || item.type || null,
    parent_id: attributes.parent_id || attributes.parent?.id || null,
    path: attributes.path_display || attributes.display_path || null,
    size: contentInfo.size || null,
    mime_type: contentInfo.mime_type || null,
    owner: ownerInfo.display_name || ownerInfo.name || null,
    created_time: attributes.created_time || attributes.created_at || null,
    modified_time: attributes.modified_time || recentActivity.modified_time || null,
    version: versionInfo.version_number || versionInfo.number || null,
    checksum: contentInfo.checksum || null,
    preview_url: contentInfo.preview_url || null,
    download_url: contentInfo.download_url || `${PUBLIC_BASE_URL}/api/workdrive-download?fileId=${item.id}`
  };
}

module.exports = {
  formatWorkDriveItem
};
