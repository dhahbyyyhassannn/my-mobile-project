const logger = winston.createLogger({
level: process.env.LOG_LEVEL || 'info',
format: customFormat,
transports: [
// Console
new winston.transports.Console({
format: winston.format.combine(
winston.format.colorize(),
customFormat
)
}),
// Fichier pour tous les logs
new winston.transports.File({
filename: path.join(logDir, 'combined.log'),
maxsize: 5242880, // 5MB
maxFiles: 5
}),
// Fichier pour les erreurs uniquement
new winston.transports.File({
filename: path.join(logDir, 'error.log'),
level: 'error',
maxsize: 5242880,
maxFiles: 5
})
]
});
module.exports = logger;