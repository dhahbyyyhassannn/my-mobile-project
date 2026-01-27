const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');
const authMiddleware = require('../middleware/auth.middleware');
const logger = require('../utils/logger');

// Appliquer auth sur toutes les routes
router.use(authMiddleware);

// GET /api/bureaux - Liste tous les bureaux
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const bureaux = db.prepare('SELECT * FROM bureaux ORDER BY code').all();
    
    res.json({
      success: true,
      count: bureaux.length,
      data: bureaux
    });
  } catch (error) {
    logger.error('Erreur récupération bureaux:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// GET /api/bureaux/:code - Détails d'un bureau
router.get('/:code', (req, res) => {
  try {
    const db = getDatabase();
    const bureau = db.prepare('SELECT * FROM bureaux WHERE code = ?')
      .get(req.params.code);
    
    if (!bureau) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bureau non trouvé' 
      });
    }

    // Compter les immobilisations du bureau
    const immoCount = db.prepare(`
      SELECT COUNT(*) as count 
      FROM immo_scannees 
      WHERE bureau_code = ?
    `).get(req.params.code);

    res.json({
      success: true,
      data: {
        ...bureau,
        immobilisations_count: immoCount.count
      }
    });
  } catch (error) {
    logger.error('Erreur récupération bureau:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// POST /api/bureaux - Créer un bureau
router.post('/', (req, res) => {
  try {
    const { code, designation, responsable } = req.body;

    if (!code || !designation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code et désignation requis' 
      });
    }

    const db = getDatabase();
    const result = db.prepare(`
      INSERT INTO bureaux (code, designation, responsable)
      VALUES (?, ?, ?)
    `).run(code, designation, responsable || null);

    logger.info(`✅ Bureau créé: ${code}`);

    res.status(201).json({
      success: true,
      message: 'Bureau créé avec succès',
      data: { id: result.lastInsertRowid, code, designation, responsable }
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ 
        success: false, 
        message: 'Bureau avec ce code existe déjà' 
      });
    }
    logger.error('Erreur création bureau:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// PUT /api/bureaux/:code - Mettre à jour un bureau
router.put('/:code', (req, res) => {
  try {
    const { designation, responsable } = req.body;
    const db = getDatabase();

    const result = db.prepare(`
      UPDATE bureaux 
      SET designation = ?, responsable = ?
      WHERE code = ?
    `).run(designation, responsable, req.params.code);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bureau non trouvé' 
      });
    }

    logger.info(`✅ Bureau mis à jour: ${req.params.code}`);

    res.json({
      success: true,
      message: 'Bureau mis à jour avec succès'
    });
  } catch (error) {
    logger.error('Erreur MAJ bureau:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// DELETE /api/bureaux/:code - Supprimer un bureau
router.delete('/:code', (req, res) => {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM bureaux WHERE code = ?')
      .run(req.params.code);

    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bureau non trouvé' 
      });
    }

    logger.info(`🗑️ Bureau supprimé: ${req.params.code}`);

    res.json({
      success: true,
      message: 'Bureau supprimé avec succès'
    });
  } catch (error) {
    logger.error('Erreur suppression bureau:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

module.exports = router;