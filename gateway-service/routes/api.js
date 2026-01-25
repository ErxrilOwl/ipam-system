const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const ipRoutes = require('./ip');

router.use('/auth', authRoutes);
router.use('/ip-addresses', ipRoutes);

module.exports = router;