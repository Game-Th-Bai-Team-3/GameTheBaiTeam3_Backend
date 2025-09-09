// src/routes/helloRoutes.js
const express = require("express");
const router = express.Router();
const { sayHello } = require("../controllers/helloController");

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Trả về lời chào
 *     tags:
 *       - Hello
 *     responses:
 *      
 *       200:
 *         description: Thành công
 */
router.get("/hello", sayHello);

module.exports = router;
