const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Mock users - À remplacer par vraie base de données
const users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$XQKvv7EYvPjKwB5vxHlIvO0HvF4zV8zY7qZ1mLx8K7nV5F2wYGJ8u', // "admin123"
    role: 'admin',
    email: 'admin@sepcm.com'
  },
  {
    id: 2,
    username: 'user',
    password: '$2a$10$XQKvv7EYvPjKwB5vxHlIvO0HvF4zV8zY7qZ1mLx8K7nV5F2wYGJ8u', // "user123"
    role: 'user',
    email: 'user@sepcm.com'
  }
];

// Validation middleware
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username requis'),
  body('password').notEmpty().withMessage('Password requis')
];

// POST /api/auth/login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Trouver l'utilisateur
    const user = users.find(u => u.username === username);
    if (!user) {
      logger.warn(`Tentative de connexion échouée: ${username}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants invalides' 
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn(`Mot de passe incorrect pour: ${username}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Identifiants invalides' 
      });
    }

    // Générer JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`✅ Connexion réussie: ${username}`);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    logger.error('Erreur login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la connexion' 
    });
  }
});

// POST /api/auth/register (optionnel)
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username min 3 caractères'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username déjà utilisé' 
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: 'user'
    };

    users.push(newUser);

    logger.info(`✅ Nouvel utilisateur créé: ${username}`);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    logger.error('Erreur register:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'inscription' 
    });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth.middleware'), (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'Utilisateur non trouvé' 
    });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  logger.info('Déconnexion utilisateur');
  res.json({ 
    success: true, 
    message: 'Déconnexion réussie' 
  });
});

module.exports = router;