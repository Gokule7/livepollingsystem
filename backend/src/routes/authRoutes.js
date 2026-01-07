const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.post('/change-password', auth, AuthController.changePassword);
router.get('/verify', auth, AuthController.verifyToken);

module.exports = router;
