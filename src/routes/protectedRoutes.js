const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../controllers/protectedController");
const { protect,authorizeRoles } = require("../middlewares/authMiddleware");

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
//day la cach de phan quyen cho tung role co ca xac thuc dang nhap (cai protect)la xac thuc co dang nhap
//hay khong con authorizeRoles("user","admin") la phan quyen cho tung role
router.get("/protected", protect,authorizeRoles("user","admin"), protectedRoute);

module.exports = router;
