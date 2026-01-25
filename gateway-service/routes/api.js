const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const ipRoutes = require('./ip');
const auditLogRoutes = require('./audit-log');

router.use('/auth', authRoutes);
router.use('/ip-addresses', ipRoutes);
router.use('/audit-logs', auditLogRoutes);

module.exports = router;