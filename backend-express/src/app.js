const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const bureauRoutes = require('./routes/bureau.routes');
const immoRoutes = require('./routes/immo.routes');
const syncRoutes = require('./routes/sync.routes');
const reportRoutes = require('./routes/report.routes');

const errorMiddleware = require('./middleware/error.middleware');
const loggerMiddleware = require('./middleware/logger.middleware');

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger middleware
app.use(loggerMiddleware);

// Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/bureaux', bureauRoutes);
app.use('/api/immo', immoRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/report', reportRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Gestion Immobilisations',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      bureaux: '/api/bureaux',
      immobilisations: '/api/immo',
      synchronisation: '/api/sync',
      rapports: '/api/report'
    }
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route non trouvée',
      path: req.path
    }
  });
});

// Middleware de gestion d'erreurs global
app.use(errorMiddleware);

module.exports = app;
