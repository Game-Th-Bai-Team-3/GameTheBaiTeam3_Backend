// src/routes/helloRoutes.js
const express = require("express");
const router = express.Router();
const { sayHello } = require("../controllers/helloController");
const { protect } = require("../middlewares/authMiddleware");
/**
 * @swagger
 * /hello/hello:
 *   get:
 *     summary: Trả về lời chào
 *     tags:
 *       - Hello
 *     security:
 *       - BearerAuth: []
 *     responses:
 *      
 *       200:
 *         description: Thành công
 */
router.get("/hello",protect, sayHello);

module.exports = router;
