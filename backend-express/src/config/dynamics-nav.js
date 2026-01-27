module.exports = {
  baseURL: process.env.NAV_BASE_URL,
  auth: {
    username: process.env.NAV_USERNAME,
    password: process.env.NAV_PASSWORD,
    domain: process.env.NAV_DOMAIN || ''
  },
  endpoints: {
    immobilisations: '/Immobilisations',
    bureaux: '/Departements', // Adapter selon votre configuration NAV
    fournisseurs: '/Fournisseurs'
  },
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json, application/atom+xml'
  },
  retry: {
    maxRetries: 3,
    retryDelay: 1000
  }
};