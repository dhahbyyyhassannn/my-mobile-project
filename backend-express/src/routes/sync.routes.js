const express = require('express');
const router = express.Router();
const syncService = require('../services/sync-service');
const compareService = require('../services/compare-service');
const authMiddleware = require('../middleware/auth.middleware');
const logger = require('../utils/logger');

router.use(authMiddleware);

// POST /api/sync/immobilisations - Synchroniser depuis NAV
router.post('/immobilisations', async (req, res) => {
  try {
    logger.info('🔄 Démarrage sync immobilisations...');
    const result = await syncService.syncImmobilisations();

    res.json({
      success: true,
      message: 'Synchronisation terminée',
      data: result
    });
  } catch (error) {
    logger.error('Erreur sync immobilisations:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur synchronisation' 
    });
  }
});

// POST /api/sync/bureaux - Synchroniser bureaux
router.post('/bureaux', async (req, res) => {
  try {
    logger.info('🔄 Démarrage sync bureaux...');
    const result = await syncService.syncBureaux();

    res.json({
      success: true,
      message: 'Synchronisation bureaux terminée',
      data: result
    });
  } catch (error) {
    logger.error('Erreur sync bureaux:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur synchronisation bureaux' 
    });
  }
});

// POST /api/sync/all - Synchronisation complète
router.post('/all', async (req, res) => {
  try {
    logger.info('🔄 Démarrage sync complète...');
    const results = await syncService.syncAll();

    res.json({
      success: results.success,
      message: results.success ? 'Synchronisation complète réussie' : 'Synchronisation terminée avec erreurs',
      data: results
    });
  } catch (error) {
    logger.error('Erreur sync complète:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur synchronisation complète' 
    });
  }
});

// GET /api/sync/history - Historique des synchronisations
router.get('/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = syncService.getSyncHistory(limit);

    res.json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    logger.error('Erreur récupération historique:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /api/sync/last - Dernière synchronisation
router.get('/last', (req, res) => {
  try {
    const type = req.query.type || null;
    const lastSync = syncService.getLastSync(type);

    res.json({
      success: true,
      data: lastSync
    });
  } catch (error) {
    logger.error('Erreur récupération dernière sync:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// POST /api/sync/compare - Comparer scan avec NAV
router.post('/compare', (req, res) => {
  try {
    const { scanSessionId } = req.body;

    if (!scanSessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'scanSessionId requis' 
      });
    }

    logger.info(`🔄 Comparaison session: ${scanSessionId}`);
    const result = compareService.compare(scanSessionId);

    res.json({
      success: true,
      message: 'Comparaison terminée',
      data: result
    });
  } catch (error) {
    logger.error('Erreur comparaison:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur comparaison' 
    });
  }
});

// GET /api/sync/compare/:sessionId - Résultats de comparaison
router.get('/compare/:sessionId', (req, res) => {
  try {
    const results = compareService.getResults(req.params.sessionId);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    logger.error('Erreur récupération résultats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

module.exports = router;