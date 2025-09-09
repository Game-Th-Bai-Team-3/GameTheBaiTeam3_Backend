const express = require('express');
const router = express.Router();

// Import các router con
const helloRoutes = require('./helloRoutes');
const authRoutes = require('./authRoutes');

// Gộp các router con vào router gốc
router.use('/', helloRoutes);
router.use('/', authRoutes);

module.exports = router;
