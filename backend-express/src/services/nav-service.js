const axios = require('axios');
const navConfig = require('../config/dynamics-nav');
const logger = require('../utils/logger');

class NavService {
  constructor() {
    this.client = axios.create({
      baseURL: navConfig.baseURL,
      timeout: navConfig.timeout,
      headers: navConfig.headers,
      auth: {
        username: navConfig.auth.username,
        password: navConfig.auth.password
      }
    });

    // Intercepteur pour logger les requêtes
    this.client.interceptors.request.use(
      config => {
        logger.debug(`NAV Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      error => {
        logger.error('NAV Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Intercepteur pour logger les réponses
    this.client.interceptors.response.use(
      response => {
        logger.debug(`NAV Response: ${response.status} ${response.config.url}`);
        return response;
      },
      error => {
        logger.error('NAV Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  async testConnection() {
    try {
      logger.info('🔌 Test de connexion à Dynamics NAV...');
      const response = await this.client.get('/');
      logger.info('✅ Connexion NAV réussie');
      return { 
        success: true, 
        status: response.status,
        message: 'Connexion établie avec succès'
      };
    } catch (error) {
      logger.error('❌ Erreur de connexion NAV:', error.message);
      throw new Error(`Impossible de se connecter à Dynamics NAV: ${error.message}`);
    }
  }

  async fetchImmobilisations(filter = '') {
    try {
      logger.info('📥 Récupération des immobilisations depuis NAV...');
      
      let url = navConfig.endpoints.immobilisations;
      if (filter) {
        url += `?$filter=${filter}`;
      }
      
      const response = await this.client.get(url);
      const data = response.data.value || [];
      
      logger.info(`✅ ${data.length} immobilisations récupérées`);
      return data;
    } catch (error) {
      logger.error('❌ Erreur récupération immobilisations:', error.message);
      throw error;
    }
  }

  async fetchBureaux() {
    try {
      logger.info('📥 Récupération des bureaux depuis NAV...');
      const response = await this.client.get(navConfig.endpoints.bureaux);
      const data = response.data.value || [];
      
      logger.info(`✅ ${data.length} bureaux récupérés`);
      return data;
    } catch (error) {
      logger.error('❌ Erreur récupération bureaux:', error.message);
      throw error;
    }
  }

  async updateImmobilisation(code, data) {
    try {
      logger.info(`📤 Mise à jour immobilisation ${code} dans NAV...`);
      
      const response = await this.client.patch(
        `${navConfig.endpoints.immobilisations}('${code}')`,
        data
      );
      
      logger.info(`✅ Immobilisation ${code} mise à jour avec succès`);
      return response.data;
    } catch (error) {
      logger.error(`❌ Erreur MAJ immobilisation ${code}:`, error.message);
      throw error;
    }
  }

  async createImmobilisation(data) {
    try {
      logger.info('📤 Création nouvelle immobilisation dans NAV...');
      
      const response = await this.client.post(
        navConfig.endpoints.immobilisations,
        data
      );
      
      logger.info(`✅ Immobilisation créée: ${data.code}`);
      return response.data;
    } catch (error) {
      logger.error('❌ Erreur création immobilisation:', error.message);
      throw error;
    }
  }

  async deleteImmobilisation(code) {
    try {
      logger.info(`🗑️  Suppression immobilisation ${code} dans NAV...`);
      
      await this.client.delete(
        `${navConfig.endpoints.immobilisations}('${code}')`
      );
      
      logger.info(`✅ Immobilisation ${code} supprimée`);
      return { success: true };
    } catch (error) {
      logger.error(`❌ Erreur suppression immobilisation ${code}:`, error.message);
      throw error;
    }
  }
}

module.exports = new NavService();