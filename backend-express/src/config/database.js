const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const DB_PATH = process.env.DB_PATH || './data/immobilisations.db';

let db = null;

function getDatabase() {
  if (!db) {
    // Créer le dossier data s'il n'existe pas
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH, { verbose: logger.debug });
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDatabase() {
  const database = getDatabase();
  
  logger.info('📊 Initialisation de la base de données...');

  // Table Bureaux (référence depuis NAV)
  database.exec(`
    CREATE TABLE IF NOT EXISTS bureaux (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      designation TEXT,
      responsable TEXT,
      date_scan DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Immobilisations NAV (données synchronisées depuis NAV)
  database.exec(`
    CREATE TABLE IF NOT EXISTS immobilisations_nav (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      designation TEXT,
      numero_fournisseur TEXT,
      numero_societe TEXT,
      responsable TEXT,
      designation_recherche TEXT,
      groupe_compta TEXT,
      date_debut_amortisse TEXT,
      nombre_annees_amortisse INTEGER,
      code_ajax TEXT,
      numero_serie TEXT,
      code_emplacement TEXT,
      synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Scans d'immobilisations (inventaire physique)
  database.exec(`
    CREATE TABLE IF NOT EXISTS immo_scannees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      designation TEXT,
      bureau_code TEXT,
      scan_session_id TEXT NOT NULL,
      scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bureau_code) REFERENCES bureaux(code)
    )
  `);

  // Index pour performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_immo_scannees_session 
    ON immo_scannees(scan_session_id)
  `);
  
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_immo_scannees_code 
    ON immo_scannees(code)
  `);

  // Table Résultats de comparaison
  database.exec(`
    CREATE TABLE IF NOT EXISTS resultats_comparaison (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      designation TEXT,
      statut TEXT CHECK(statut IN ('VALIDE', 'EN_PLUS', 'PERDU')) NOT NULL,
      bureau_code TEXT,
      session_id TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Index pour les résultats
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_resultats_session 
    ON resultats_comparaison(session_id)
  `);
  
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_resultats_statut 
    ON resultats_comparaison(statut)
  `);

  // Table Historique des synchronisations
  database.exec(`
    CREATE TABLE IF NOT EXISTS sync_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      statut TEXT NOT NULL,
      nb_records INTEGER DEFAULT 0,
      message TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  logger.info('✅ Base de données initialisée avec succès');
}

function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    logger.info('🔒 Base de données fermée');
  }
}

module.exports = { 
  getDatabase, 
  initDatabase, 
  closeDatabase 
};