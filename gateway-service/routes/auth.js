const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.get('/me', authController.me);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/users', authController.createUser);

module.exports = router;