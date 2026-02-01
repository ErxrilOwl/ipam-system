const express = require('express');
const router = express.Router();

const auditLogController = require('../controllers/audit-log');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, auditLogController.getAuditLogs);
router.get('/:id', authMiddleware, auditLogController.getAuditLog);

module.exports = router;