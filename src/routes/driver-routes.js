const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const { updateLocation } = require('../controllers/driver-controller');
const router = express.Router();

router.post('/location', authMiddleware, updateLocation);

module.exports = router;
