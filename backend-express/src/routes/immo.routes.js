const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');
const authMiddleware = require('../middleware/auth.middleware');
const scanService = require('../services/scan-service');
const logger = require('../utils/logger');

router.use(authMiddleware);

// GET /api/immo - Liste toutes les immobilisations NAV
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const { search, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM immobilisations_nav';
    const params = [];

    if (search) {
      query += ' WHERE code LIKE ? OR designation LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY code LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const immos = db.prepare(query).all(...params);
    
    // Compter le total
    let countQuery = 'SELECT COUNT(*) as total FROM immobilisations_nav';
    if (search) {
      countQuery += ' WHERE code LIKE ? OR designation LIKE ?';
    }
    const total = db.prepare(countQuery).get(...(search ? [`%${search}%`, `%${search}%`] : []));

    res.json({
      success: true,
      count: immos.length,
      total: total.total,
      data: immos
    });
  } catch (error) {
    logger.error('Erreur récupération immobilisations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /api/immo/:code - Détails d'une immobilisation
router.get('/:code', (req, res) => {
  try {
    const db = getDatabase();
    const immo = db.prepare('SELECT * FROM immobilisations_nav WHERE code = ?')
      .get(req.params.code);

    if (!immo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Immobilisation non trouvée' 
      });
    }

    res.json({
      success: true,
      data: immo
    });
  } catch (error) {
    logger.error('Erreur récupération immobilisation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// POST /api/immo/scan - Scanner des immobilisations
router.post('/scan', (req, res) => {
  try {
    const { immobilisations, bureauCode } = req.body;

    if (!Array.isArray(immobilisations) || immobilisations.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Liste d\'immobilisations invalide' 
      });
    }

    const result = scanService.scanImmobilisations(immobilisations, bureauCode);

    logger.info(`✅ Scan enregistré: ${result.count} immobilisations`);

    res.json({
      success: true,
      message: 'Scan enregistré avec succès',
      data: result
    });
  } catch (error) {
    logger.error('Erreur scan immobilisations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /api/immo/scanned/:sessionId - Immobilisations scannées
router.get('/scanned/:sessionId', (req, res) => {
  try {
    const immos = scanService.getScannedImmos(req.params.sessionId);

    res.json({
      success: true,
      count: immos.length,
      data: immos
    });
  } catch (error) {
    logger.error('Erreur récupération immos scannées:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// DELETE /api/immo/scan/:sessionId - Supprimer un scan
router.delete('/scan/:sessionId', (req, res) => {
  try {
    scanService.clearScans(req.params.sessionId);

    res.json({
      success: true,
      message: 'Scan supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression scan:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /api/immo/stats - Statistiques
router.get('/stats/general', (req, res) => {
  try {
    const db = getDatabase();
    
    const stats = {
      total_nav: db.prepare('SELECT COUNT(*) as count FROM immobilisations_nav').get().count,
      total_scanned: db.prepare('SELECT COUNT(*) as count FROM immo_scannees').get().count,
      bureaux_count: db.prepare('SELECT COUNT(*) as count FROM bureaux').get().count,
      last_sync: db.prepare('SELECT MAX(synced_at) as last FROM immobilisations_nav').get().last,
      last_scan: db.prepare('SELECT MAX(scanned_at) as last FROM immo_scannees').get().last
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Erreur statistiques:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

module.exports = router;