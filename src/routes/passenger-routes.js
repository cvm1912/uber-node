const { createBooking } = require('../controllers/passenger-controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

router.post('/ride', authMiddleware, createBooking);

module.exports = router;
