const DEFAULT_PUBLIC_API_BASE_URL = 'https://vmsantos44-zoho-api-backend-djnrgh2p4.vercel.app';

function getPublicApiBaseUrl() {
  return process.env.PUBLIC_API_BASE_URL || DEFAULT_PUBLIC_API_BASE_URL;
}

module.exports = {
  DEFAULT_PUBLIC_API_BASE_URL,
  getPublicApiBaseUrl
};
