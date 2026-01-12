import { Alert } from 'react-native';
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(require('cors'));
const D356={
    tenant_id: '',
    client_id: '',
    client_secret: '',
    resource_url:'',
    api_version:'',
}
const db_path=path.join(__dirname,'dynamics365_data.db');
let db ;  
function initDatabase() {
    db= new sqlite3.Database(db_path, (err)=> {
        if (err) {
            Alert.alert(
                'Erreur SQLite',
                err.message
              );
        }
        else {
            createTables();
        }
    });
}
    
// server.js - Backend pour Inventaire Immobilisations
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuration Dynamics 365
const D365_CONFIG = {
  tenant_id: process.env.TENANT_ID || 'VOTRE_TENANT_ID',
  client_id: process.env.CLIENT_ID || 'VOTRE_CLIENT_ID',
  client_secret: process.env.CLIENT_SECRET || 'VOTRE_CLIENT_SECRET',
  resource_url: process.env.RESOURCE_URL || 'https://votre-org.crm4.dynamics.com',
  api_version: 'v9.2'
};

const DB_PATH = path.join(__dirname, 'inventaire.db');
let db;

// ============= INITIALISATION BASE DE DONNÉES =============

function initDatabase() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Erreur connexion SQLite:', err);
    } else {
      console.log('✓ SQLite connecté');
      createTables();
    }
  });
}

function createTables() {
  const tables = [
    // Table principale des immobilisations (lecture seule depuis D365)
    `CREATE TABLE IF NOT EXISTS immobilisations (
      Numero INTEGER PRIMARY KEY,
      Designation TEXT,
      NumeroFournisseur TEXT,
      NumeroSocieteMaintenance TEXT,
      Responsable TEXT,
      DesignationRecherche TEXT,
      GroupeCompt INTEGER,
      DateDebutAmortissement TEXT,
      NombreAnneesAmortissement INTEGER,
      CodeAjix INTEGER UNIQUE,
      NumeroSerie TEXT,
      Bureau TEXT,
      last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS inventaire_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_name TEXT NOT NULL,
      bureau TEXT NOT NULL,
      date_debut DATETIME DEFAULT CURRENT_TIMESTAMP,
      date_fin DATETIME,
      statut TEXT DEFAULT 'en_cours',
      total_attendu INTEGER DEFAULT 0,
      total_scanne INTEGER DEFAULT 0,
      total_trouve INTEGER DEFAULT 0,
      total_perdu INTEGER DEFAULT 0,
      total_supplementaire INTEGER DEFAULT 0,
      created_by TEXT,
      rapport_path TEXT
    )`,
    
    `CREATE TABLE IF NOT EXISTS inventaire_attendu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      numero_immo INTEGER NOT NULL,
      code_ajix INTEGER NOT NULL,
      designation TEXT,
      responsable TEXT,
      numero_serie TEXT,
      statut TEXT DEFAULT 'non_scanne',
      FOREIGN KEY (session_id) REFERENCES inventaire_sessions(id),
      UNIQUE(session_id, numero_immo)
    )`,
    
    `CREATE TABLE IF NOT EXISTS inventaire_scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      code_ajix INTEGER NOT NULL,
      numero_immo INTEGER,
      designation TEXT,
      scan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      statut TEXT,
      commentaire TEXT,
      FOREIGN KEY (session_id) REFERENCES inventaire_sessions(id)
    )`,
    
    // Table des résultats finaux
    `CREATE TABLE IF NOT EXISTS inventaire_resultats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      numero_immo INTEGER,
      code_ajix INTEGER,
      designation TEXT,
      categorie TEXT,
      commentaire TEXT,
      FOREIGN KEY (session_id) REFERENCES inventaire_sessions(id)
    )`,
    
    // Index
    `CREATE INDEX IF NOT EXISTS idx_immo_bureau ON immobilisations(Bureau)`,
    `CREATE INDEX IF NOT EXISTS idx_immo_codeajix ON immobilisations(CodeAjix)`,
    `CREATE INDEX IF NOT EXISTS idx_attendu_session ON inventaire_attendu(session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_scans_session ON inventaire_scans(session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_resultats_session ON inventaire_resultats(session_id)`,
  ];
    tables.forEach(sql => {
      db.run(sql, (err) => {
        if (err) console.error('Erreur création table:', err);
      });
    });
  }
async function getAccessToken(){
    try{
        const response = await axios.post('https://login.microsoftonline.com/${D365.tenant_id}/oauth2/token', {
            grant_type: 'client_credentials',
            client_id: D356.client_id,
            client_secret: D356.client_secret,
            resource: D356.resource_url,
        });
        return response.data.access_token;
    }catch(error){
        console.error('Error getting access token:', error);
        throw error;    
    }
}  
app.get('/api/immobilisation/:codeAjix', async (req, res) => {
const { codeAjix } = req.params;
db.get(
    'SELECT * FROM immobilisations WHERE CodeAjix = ?',
    [codeAjix],
    async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur SQLite', details: err.message });
        }
        if (row) {
            // trouvé dans la base locale
            return res.json({
                success: true,
                source: 'offline',
                data: row
            });
        } else {
            try {
                const token = await getAccessToken();

                const response = await axios.get(
                    `${D365_CONFIG.resource_url}/api/data/${D365_CONFIG.api_version}/Immobilisations?$filter=CodeAjix eq '${codeAjix}'`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'OData-MaxVersion': '4.0',
                            'OData-Version': '4.0'
                        }
                    }
                );

                // Modifiez selon la forme exacte du résultat de D365
                const d365Item = response.data.value && response.data.value[0];
                if (d365Item) {
                    return res.json({
                        success: true,
                        source: 'online',
                        data: d365Item
                    });
                } else {
                    return res.status(404).json({ success: false, message: 'Immobilisation non trouvée.' });
                }
            } catch (apiError) {
                return res.status(500).json({ 
                    error: 'Erreur lors de la récupération via D365', 
                    details: apiError.message 
                });
            }
        }
    }
);
});