const express = require('express');
const router = express.Router();

// Import các router con
const helloRoutes = require('./helloRoutes');
const authRoutes = require('./authRoutes');
const protectedRoutes = require('./protectedRoutes');
const cardRoutes = require('./cardRoutes');
const playerProfileRoutes = require('./playerProfileRoutes');
const test = require('./test');
// Gắn prefix cho từng router con
router.use('/hello', helloRoutes);           // ví dụ: /hello/...
router.use('/auth', authRoutes);             // ví dụ: /auth/login, /auth/register
router.use('/api', protectedRoutes);         // ví dụ: /api/protected
router.use('/cards', cardRoutes);           // ví dụ: /card/...)
router.use('/player-profiles', playerProfileRoutes); // ví dụ: /player-profiles/...
router.use('/test', test); // ví dụ: /test/...
module.exports = router;
