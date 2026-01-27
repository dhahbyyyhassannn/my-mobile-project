const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const start = Date.now();

  // Log de la requête
  logger.info(`➡️  ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Intercepter la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel](`⬅️  ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });

  next();
};