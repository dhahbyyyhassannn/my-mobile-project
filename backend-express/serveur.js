const app = require('./app');
const logger = require('./utils/logger');
const { initDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

// Initialiser la base de données
initDatabase();

// Démarrer le serveur
const server = app.listen(PORT, () => {
  logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
  logger.info(`📊 Environnement: ${process.env.NODE_ENV}`);
  logger.info(`🗄️  Base de données: ${process.env.DB_PATH}`);
  logger.info(`🌐 URL: http://localhost:${PORT}`);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt du serveur...');
  server.close(() => {
    logger.info('Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT reçu, arrêt du serveur...');
  server.close(() => {
    logger.info('Serveur fermé');
    process.exit(0);
  });
});

module.exports = server;