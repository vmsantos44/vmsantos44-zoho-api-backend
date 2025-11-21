const axios = require('axios');

/**
 * Minimal Zoho WorkDrive API wrapper used by the Next.js routes.
 * Handles OAuth token refresh, required headers, and helper methods.
 */
class WorkDriveAPI {
  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    this.apiDomain = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
    this.accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN || 'https://accounts.zoho.com';
    this.orgId = process.env.ZOHO_WORKDRIVE_ORG_ID;
    this.defaultParentId = process.env.ZOHO_WORKDRIVE_DEFAULT_PARENT_ID || null;
    this.accessToken = null;
    this.tokenExpiry = null;

    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      throw new Error('Zoho OAuth credentials are not fully configured');
    }

    if (!this.orgId) {
      throw new Error('ZOHO_WORKDRIVE_ORG_ID environment variable is required');
    }
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.accountsDomain}/oauth/v2/token`,
        null,
        {
          params: {
            refresh_token: this.refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'refresh_token'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Error getting WorkDrive access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Zoho WorkDrive');
    }
  }

  async getHeaders(additionalHeaders = {}) {
    const token = await this.getAccessToken();
    return {
      Authorization: `Zoho-oauthtoken ${token}`,
      'X-WorkDrive-Organization': this.orgId,
      ...additionalHeaders
    };
  }

  async searchFiles({ query, parentId, includeFolders = true, limit = 20, offset = 0 }) {
    if (!query) {
      throw new Error('Search query is required');
    }

    const headers = await this.getHeaders();
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);
    const payload = {
      search_text: query,
      page_info: {
        offset: Math.max(parseInt(offset, 10) || 0, 0),
        limit: safeLimit
      },
      filter_param: {
        type: includeFolders ? ['files', 'folders'] : ['files']
      }
    };

    const effectiveParent = parentId || this.defaultParentId;
    if (effectiveParent) {
      payload.filter_param.parent_id = effectiveParent;
    }

    const response = await axios.post(
      `${this.apiDomain}/workdrive/api/v1/search`,
      payload,
      { headers }
    );

    return response.data;
  }

  async listFolder({ parentId, limit = 50, nextToken = null }) {
    const folderId = parentId || this.defaultParentId;
    if (!folderId) {
      throw new Error('parentId is required (or set ZOHO_WORKDRIVE_DEFAULT_PARENT_ID)');
    }

    const headers = await this.getHeaders();
    const params = {
      limit: Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200)
    };

    if (nextToken) {
      params.next_token = nextToken;
    }

    const response = await axios.get(
      `${this.apiDomain}/workdrive/api/v1/files/${folderId}/files`,
      {
        headers,
        params
      }
    );

    return response.data;
  }

  async getFileDetails(fileId) {
    if (!fileId) {
      throw new Error('fileId is required');
    }

    const headers = await this.getHeaders();
    const response = await axios.get(
      `${this.apiDomain}/workdrive/api/v1/files/${fileId}`,
      { headers }
    );

    return response.data;
  }

  async downloadFile(fileId, responseType = 'arraybuffer') {
    if (!fileId) {
      throw new Error('fileId is required');
    }

    const headers = await this.getHeaders();
    return axios.get(
      `${this.apiDomain}/workdrive/api/v1/download/${fileId}`,
      {
        headers,
        responseType
      }
    );
  }
}

module.exports = WorkDriveAPI;
