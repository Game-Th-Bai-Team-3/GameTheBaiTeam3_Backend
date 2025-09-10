const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../controllers/protectedController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: API protected, cần JWT token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Truy cập thành công
 *       401:
 *         description: Token không hợp lệ hoặc chưa đăng nhập
 */
router.get("/protected", protect, protectedRoute);

module.exports = router;
