// src/routes/helloRoutes.js
const express = require("express");
const router = express.Router();
const { sayHello } = require("../controllers/helloController");

// Route GET /api/hello
router.get("/hello", sayHello);

module.exports = router;
