const express = require('express');
const router = express.Router();

const ipController = require('../controllers/ip');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, ipController.getIpAddresses);
router.post('/', authMiddleware, ipController.createIPAddress);
router.put('/:id', authMiddleware, ipController.updateIPAddress);
router.delete('/:id', authMiddleware, ipController.deleteIPAddress);

module.exports = router;