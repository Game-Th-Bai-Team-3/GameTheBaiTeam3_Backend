const express = require('express');
const router = express.Router();

// Import các router con
const helloRoutes = require('./helloRoutes');
const authRoutes = require('./authRoutes');
const protectedRoutes = require('./protectedRoutes');
const cardRoutes = require('./cardRoutes');
const imageMergeRoutes = require('./imageMergeRoutes');

// Gắn prefix cho từng router con
router.use('/hello', helloRoutes);           // ví dụ: /hello/...
router.use('/auth', authRoutes);             // ví dụ: /auth/login, /auth/register
router.use('/api', protectedRoutes);         // ví dụ: /api/protected
router.use('/cards', cardRoutes);           // ví dụ: /card/...
router.use('/api/image-merge', imageMergeRoutes); // ví dụ: /api/image-merge/merge
module.exports = router;
