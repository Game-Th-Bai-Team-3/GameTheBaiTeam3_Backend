const express = require('express');
const router = express.Router();

// Import các router con
const helloRoutes = require('./helloRoutes');
const authRoutes = require('./authRoutes');
const protectedRoutes = require('./protectedRoutes');
const cardRoutes = require('./cardRoutes');
const imageRoutes = require('./imageRoutes');
// Gắn prefix cho từng router con
router.use('/hello', helloRoutes);           // ví dụ: /hello/...
router.use('/auth', authRoutes);             // ví dụ: /auth/login, /auth/register
router.use('/api', protectedRoutes);         // ví dụ: /api/protected
router.use('/cards', cardRoutes);           // ví dụ: /card/...)
router.use('/api/images', imageRoutes);      // ví dụ: /api/images/process
module.exports = router;
