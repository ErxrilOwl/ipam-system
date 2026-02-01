const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const ipRoutes = require('./ip');
const userRoutes = require('./user');
const auditLogRoutes = require('./audit-log');

router.use('/auth', authRoutes);
router.use('/ip-addresses', ipRoutes);
router.use('/users', userRoutes);
router.use('/audit-logs', auditLogRoutes);

module.exports = router;