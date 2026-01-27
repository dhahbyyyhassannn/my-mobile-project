const { getDatabase } = require('../config/database');
const logger = require('../utils/logger');
const crypto = require('crypto');

class ScanService {
  generateSessionId() {
    return crypto.randomUUID();
  }

  scanBureaux(bureauxData) {
    const db = getDatabase();
    const sessionId = this.generateSessionId();
    
    logger.info(`🔍 Début scan bureaux - Session: ${sessionId}`);
    
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO bureaux (code, designation, responsable, date_scan)
      VALUES (?, ?, ?, datetime('now'))
    `);

    const insertMany = db.transaction((bureaux) => {
      for (const bureau of bureaux) {
        insertStmt.run(
          bureau.code,
          bureau.designation,
          bureau.responsable
        );
      }
    });

    insertMany(bureauxData);
    
    logger.info(`✅ ${bureauxData.length} bureaux scannés et stockés`);
    
    return { 
      sessionId, 
      count: bureauxData.length,
      timestamp: new Date().toISOString()
    };
  }

  scanImmobilisations(immoData, bureauCode = null) {
    const db = getDatabase();
    const sessionId = this.generateSessionId();
    
    logger.info(`🔍 Début scan immobilisations - Session: ${sessionId}`);
    
    const insertStmt = db.prepare(`
      INSERT INTO immo_scannees (code, designation, bureau_code, scan_session_id)
      VALUES (?, ?, ?, ?)
    `);

    const insertMany = db.transaction((immos) => {
      let successCount = 0;
      for (const immo of immos) {
        try {
          insertStmt.run(
            immo.code,
            immo.designation || '',
            bureauCode,
            sessionId
          );
          successCount++;
        } catch (error) {
          logger.warn(`Erreur insertion immo ${immo.code}:`, error.message);
        }
      }
      return successCount;
    });

    const count = insertMany(immoData);
    
    logger.info(`✅ ${count} immobilisations scannées sur ${immoData.length}`);
    
    return { 
      sessionId, 
      count,
      total: immoData.length,
      bureauCode,
      timestamp: new Date().toISOString()
    };
  }

  getScannedImmos(sessionId = null) {
    const db = getDatabase();
    
    let query = 'SELECT * FROM immo_scannees';
    const params = [];
    
    if (sessionId) {
      query += ' WHERE scan_session_id = ?';
      params.push(sessionId);
    }
    
    query += ' ORDER BY scanned_at DESC';
    
    const results = db.prepare(query).all(...params);
    logger.debug(`Récupération de ${results.length} immobilisations scannées`);
    
    return results;
  }

  getLastScanSession() {
    const db = getDatabase();
    
    const result = db.prepare(`
      SELECT scan_session_id, COUNT(*) as count, MAX(scanned_at) as last_scan
      FROM immo_scannees
      GROUP BY scan_session_id
      ORDER BY last_scan DESC
      LIMIT 1
    `).get();
    
    return result;
  }

  clearScans(sessionId = null) {
    const db = getDatabase();
    
    if (sessionId) {
      db.prepare('DELETE FROM immo_scannees WHERE scan_session_id = ?').run(sessionId);
      db.prepare('DELETE FROM resultats_comparaison WHERE session_id = ?').run(sessionId);
      logger.info(`🗑️  Session ${sessionId} effacée`);
    } else {
      db.prepare('DELETE FROM immo_scannees').run();
      db.prepare('DELETE FROM resultats_comparaison').run();
      logger.info('🗑️  Tous les scans effacés');
    }
    
    return { success: true, sessionId };
  }
}

module.exports = new ScanService();