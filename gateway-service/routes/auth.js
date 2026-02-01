const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);
router.post('/refresh', authMiddleware, authController.refresh);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;