const express = require('express');
const router = express.Router();

const ipController = require('../controllers/ip');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, ipController.getAuditLogs);
router.get('/:id', authMiddleware, ipController.getAuditLog);

module.exports = router;