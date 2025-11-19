const axios = require('axios');

class ZohoAPI {
  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    this.apiDomain = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
    this.accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN || 'https://accounts.zoho.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Get new access token using refresh token
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
      // Set expiry to 55 minutes (tokens last 1 hour, refresh early)
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Zoho');
    }
  }

  async searchContacts(searchTerm) {
    const accessToken = await this.getAccessToken();
    
    try {
      const response = await axios.get(
        `${this.apiDomain}/crm/v2/Contacts/search`,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          },
          params: {
            criteria: `(First_Name:equals:${searchTerm})or(Last_Name:equals:${searchTerm})or(Email:equals:${searchTerm})`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error searching contacts:', error.response?.data || error.message);
      throw new Error('Failed to search contacts in Zoho CRM');
    }
  }

  async getContactById(contactId) {
    const accessToken = await this.getAccessToken();
    
    try {
      const response = await axios.get(
        `${this.apiDomain}/crm/v2/Contacts/${contactId}`,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting contact:', error.response?.data || error.message);
      throw new Error('Failed to get contact from Zoho CRM');
    }
  }

  async searchLeads(searchTerm) {
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.apiDomain}/crm/v2/Leads/search`,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          },
          params: {
            criteria: `(First_Name:equals:${searchTerm})or(Last_Name:equals:${searchTerm})or(Email:equals:${searchTerm})or(Company:equals:${searchTerm})`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error searching leads:', JSON.stringify(error.response?.data || error.message));
      throw new Error(`Failed to search leads: ${JSON.stringify(error.response?.data) || error.message}`);
    }
  }

  async getRecordNotes(module, recordId) {
    const accessToken = await this.getAccessToken();
    
    try {
      const response = await axios.get(
        `${this.apiDomain}/crm/v2/${module}/${recordId}/Notes`,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting notes:', error.response?.data || error.message);
      throw new Error('Failed to get notes from Zoho CRM');
    }
  }

  async sendEmail(toAddress, subject, body, fromAddress = null) {
    const accessToken = await this.getAccessToken();
    
    try {
      const emailData = {
        from: fromAddress || { user_name: process.env.ZOHO_FROM_EMAIL },
        to: [{ email: toAddress }],
        subject: subject,
        content: body
      };

      const response = await axios.post(
        `${this.apiDomain}/crm/v2/Emails/actions/send`,
        emailData,
        {
          headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      throw new Error('Failed to send email via Zoho CRM');
    }
  }
}

module.exports = ZohoAPI;
